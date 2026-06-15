import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, COL, sceneBg, addBackButton } from '../ui/kit.js';
import { feel } from '../systems/feel.js';
import { ACHIEVEMENTS, hasAchievement } from '../systems/progression.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }

  create() {
    AudioManager.setScene(this);
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_trophies')) {
      sceneBg(this, 'bg_trophies', 0x6E4422, 0xB07B4F);
      this.add.rectangle(0, 0, W, H, 0x3E2723, 0.45).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);
    }

    const earned = ACHIEVEMENTS.filter(a => hasAchievement(a.id)).length;
    this.add.text(W / 2, 60, '🏆 Trophy Room', { fontFamily: FONT, fontSize: '28px', color: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(W / 2, 96, earned + ' / ' + ACHIEVEMENTS.length + ' achievements earned', {
      fontFamily: FONT, fontSize: '15px', color: '#FFE9C9'
    }).setOrigin(0.5);

    // 2 columns x 3 rows of achievement cards.
    const cols = 2;
    const cw = 320, chh = 150;
    const colX = [W / 2 - 168, W / 2 + 168];
    const top = 200, rowGap = 178;

    ACHIEVEMENTS.forEach((a, i) => {
      const x = colX[i % cols];
      const y = top + Math.floor(i / cols) * rowGap;
      const got = hasAchievement(a.id);

      const g = this.add.graphics();
      g.fillStyle(0x000000, 0.25); g.fillRoundedRect(x - cw / 2, y - chh / 2 + 6, cw, chh, 18);
      g.fillStyle(got ? 0xFFD23F : 0x5a5048, 1); g.fillRoundedRect(x - cw / 2, y - chh / 2, cw, chh, 18);
      g.lineStyle(3, got ? 0xFFFFFF : 0x3b342e, 0.9); g.strokeRoundedRect(x - cw / 2, y - chh / 2, cw, chh, 18);

      this.add.text(x - cw / 2 + 36, y - 28, got ? a.icon : '🔒', { fontSize: '44px' }).setOrigin(0.5);
      this.add.text(x - cw / 2 + 72, y - 34, a.name, {
        fontFamily: FONT, fontSize: '19px', color: got ? '#3b2b20' : '#cdbfa6', fontStyle: 'bold', wordWrap: { width: cw - 90 }
      }).setOrigin(0, 0);
      this.add.text(x - cw / 2 + 72, y + 4, a.desc, {
        fontFamily: FONT, fontSize: '13px', color: got ? '#5a4632' : '#a99e8a', wordWrap: { width: cw - 90 }
      }).setOrigin(0, 0);
      this.add.text(x, y + chh / 2 - 22, got ? '✓ Earned' : 'Locked', {
        fontFamily: FONT, fontSize: '13px', color: got ? '#2e7d32' : '#a99e8a', fontStyle: 'bold'
      }).setOrigin(0.5);

      if (got) {
        const card = this.add.rectangle(x, y, cw, chh, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
        card.on('pointerdown', () => feel(this, 'legendary_chime', 'achievement'));
      }
    });

    addBackButton(this);
  }
}
