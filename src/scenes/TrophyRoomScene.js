import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, sceneBg, addBackButton } from '../ui/kit.js';
import { feel } from '../systems/feel.js';
import { ACHIEVEMENTS, hasAchievement } from '../systems/progression.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }

  create() {
    AudioManager.setScene(this);
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_trophies')) {
      sceneBg(this, 'bg_trophies', 0x6E4422, 0xB07B4F);
      this.add.rectangle(0, 0, W, H, 0x2a1a0e, 0.6).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);
    }

    const earned = ACHIEVEMENTS.filter(a => hasAchievement(a.id)).length;
    this.add.text(W / 2, 62, '🏆 Trophy Room', {
      fontFamily: FONT, fontSize: '30px', color: '#FFD23F', fontStyle: 'bold'
    }).setOrigin(0.5).setShadow(0, 3, '#00000099', 5);
    this.add.text(W / 2, 104, earned + ' of ' + ACHIEVEMENTS.length + ' trophies earned', {
      fontFamily: FONT, fontSize: '16px', color: '#FFE9C9', fontStyle: 'bold'
    }).setOrigin(0.5);

    const cols = 2, cw = 322, chh = 160;
    const colX = [W / 2 - 168, W / 2 + 168];
    const top = 215, rowGap = 192;

    ACHIEVEMENTS.forEach((a, i) => {
      const x = colX[i % cols];
      const y = top + Math.floor(i / cols) * rowGap;
      const got = hasAchievement(a.id);

      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.3); g.fillRoundedRect(x - cw / 2, y - chh / 2 + 8, cw, chh, 20);
      if (got) {
        g.fillStyle(0xF6B43C, 1); g.fillRoundedRect(x - cw / 2, y - chh / 2, cw, chh, 20);
        g.fillStyle(0xFFE08A, 1); g.fillRoundedRect(x - cw / 2 + 5, y - chh / 2 + 5, cw - 10, chh * 0.42, 16); // glossy top
        g.lineStyle(4, 0xFFFFFF, 0.95); g.strokeRoundedRect(x - cw / 2, y - chh / 2, cw, chh, 20);
      } else {
        g.fillStyle(0x4a423a, 1); g.fillRoundedRect(x - cw / 2, y - chh / 2, cw, chh, 20);
        g.lineStyle(3, 0x2e2822, 0.9); g.strokeRoundedRect(x - cw / 2, y - chh / 2, cw, chh, 20);
      }

      // Large icon on a disc.
      this.add.circle(x - cw / 2 + 54, y - 16, 42, got ? 0xFFFFFF : 0x3a342e).setAlpha(got ? 0.95 : 0.55);
      this.add.text(x - cw / 2 + 54, y - 16, got ? a.icon : '🔒', { fontSize: '48px' }).setOrigin(0.5);

      // Text block.
      this.add.text(x - cw / 2 + 104, y - 42, a.name, {
        fontFamily: FONT, fontSize: '21px', color: got ? '#3b2b20' : '#cdbfae', fontStyle: 'bold', wordWrap: { width: cw - 124 }
      }).setOrigin(0, 0);
      this.add.text(x - cw / 2 + 104, y - 8, a.desc, {
        fontFamily: FONT, fontSize: '14px', color: got ? '#6a4f24' : '#a99e8a', wordWrap: { width: cw - 124 }
      }).setOrigin(0, 0);
      this.add.text(x - cw / 2 + 104, y + chh / 2 - 32, got ? '✓ EARNED' : 'LOCKED', {
        fontFamily: FONT, fontSize: '14px', color: got ? '#1b7a2e' : '#a99e8a', fontStyle: 'bold'
      }).setOrigin(0, 0);

      if (got) {
        // Subtle shimmer on earned trophies.
        const sparkle = this.add.text(x + cw / 2 - 28, y - chh / 2 + 26, '✨', { fontSize: '24px' }).setOrigin(0.5);
        this.tweens.add({ targets: sparkle, alpha: { from: 0.35, to: 1 }, scale: { from: 0.8, to: 1.18 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        const tap = this.add.rectangle(x, y, cw, chh, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
        tap.on('pointerdown', () => feel(this, 'legendary_chime', 'achievement'));
      }
    });

    addBackButton(this);
  }
}
