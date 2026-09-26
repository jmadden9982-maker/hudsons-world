import Phaser from 'phaser';
import { S } from '../systems/state.js';
import { button, celebrateAt, COLORS, floatingTextAt, milestoneBurstAt, roundedPanel, textStyle, topBar } from '../ui/kit.js';
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
    return floatingTextAt(this, x, y, label, color);
  }

  celebrate(x, y, color = 0xffd447) {
    celebrateAt(this, x, y, color);
  }

  impact(intensity = 0.006) {
    if (!S.settings.calm) this.cameras.main.shake(120, intensity);
  }

  // Extra flourish every 5th streak/combo: a bigger burst, a camera flash and an
  // "on fire" callout, on top of whatever per-pickup feedback the scene already shows.
  milestoneBurst(x, y, count, color = 0xffd447) {
    milestoneBurstAt(this, x, y, count, color);
  }
}
