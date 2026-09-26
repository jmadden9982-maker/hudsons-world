import Phaser from 'phaser';
import { S } from '../systems/state.js';
import { button, COLORS, roundedPanel, textStyle, topBar } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import Narrator from '../systems/Narrator.js';

export default class AdventureBase extends Phaser.Scene {
  constructor(key) { super(key); this.finished = false; this.started = false; }

  begin(title, instruction, icon = '⭐') {
    this.finished = false; this.started = false; AudioManager.setScene(this); Narrator.attach(this);
    topBar(this, title);
    const { width: W, height: H } = this.scale;
    const overlay = this.add.container(0, 0).setDepth(150);
    overlay.add(this.add.rectangle(W / 2, H / 2, W, H, 0x18122c, 0.8).setInteractive());
    overlay.add(roundedPanel(this, W / 2, H / 2, 610, 500, 0xfffbef, 1, 0xffd447).setDepth(151));
    overlay.add(this.add.text(W / 2, H / 2 - 150, icon, textStyle(82)).setOrigin(0.5).setDepth(152));
    overlay.add(this.add.text(W / 2, H / 2 - 45, title, textStyle(31, COLORS.ink, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5).setDepth(152));
    overlay.add(this.add.text(W / 2, H / 2 + 30, instruction, textStyle(20, '#625773', { align: 'center', wordWrap: { width: 500 }, lineSpacing: 8 })).setOrigin(0.5).setDepth(152));
    overlay.add(button(this, W / 2, H / 2 + 112, '🔊 READ TO ME', () => Narrator.speak(`${title}. ${instruction}`), { width: 260, height: 54, color: 0x47a8e8, fontSize: 17, depth: 153 }));
    overlay.add(button(this, W / 2, H / 2 + 195, 'LET’S GO!', () => {
      overlay.destroy(); this.started = true; this.onAdventureStart?.();
    }, { width: 280, color: 0x40a95b, depth: 153, sound: 'button_confirm' }));
  }

  makeTimer(seconds, onDone) {
    this.timeLeft = seconds;
    const text = this.add.text(this.scale.width - 34, 108, `⏱ ${seconds}`, textStyle(22, '#ffffff', { fontStyle: 'bold', backgroundColor: '#211b3c', padding: { x: 14, y: 8 } })).setOrigin(1, 0.5).setDepth(40);
    this.timerEvent = this.time.addEvent({ delay: 1000, loop: true, callback: () => {
      if (!this.started || this.finished) return;
      this.timeLeft -= 1; text.setText(`⏱ ${Math.max(0, this.timeLeft)}`);
      if (this.timeLeft <= 0) { this.timerEvent.remove(); onDone(); }
    }});
    return text;
  }

  floatingText(x, y, label, color = '#ffffff') {
    const t = this.add.text(x, y, label, textStyle(23, color, { fontStyle: 'bold', stroke: '#211b3c', strokeThickness: 5 })).setOrigin(0.5).setDepth(60);
    this.tweens.add({ targets: t, y: y - 65, alpha: 0, duration: 650, onComplete: () => t.destroy() });
  }

  celebrate(x, y, color = 0xffd447) {
    if (S.settings.calm) return;
    for (let i = 0; i < 12; i += 1) {
      const angle = (Math.PI * 2 * i) / 12; const distance = Phaser.Math.Between(45, 95);
      const spark = this.add.circle(x, y, Phaser.Math.Between(3, 7), i % 3 === 0 ? 0xffffff : color, 0.95).setDepth(59);
      this.tweens.add({ targets: spark, x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance, scale: 0.15, alpha: 0, duration: 430, ease: 'Quad.easeOut', onComplete: () => spark.destroy() });
    }
  }

  impact(intensity = 0.006) {
    if (!S.settings.calm) this.cameras.main.shake(120, intensity);
  }
}
