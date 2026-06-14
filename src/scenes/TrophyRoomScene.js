import Phaser from 'phaser';
import { FONT, sceneBg } from '../ui/kit.js';
import { feel } from '../systems/feel.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }

  create() {
    const { width:W, height:H } = this.scale;

    if (this.textures.exists('bg_trophies')) {
      sceneBg(this, 'bg_trophies', 0x6E4422, 0xB07B4F);
    } else {
      this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);
    }

    this.add.text(W/2, 50, '🏆 Trophy Room', {
      fontFamily: FONT,
      fontSize: '28px',
      color: '#FFE9C9',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const rows = [
      ['🏃 Douglas Dash best', '—'],
      ['🎃 Pumpkin Smash best', '—'],
      ['🚀 Space Rescue best', '—'],
      ['🏆 Critter Cards', '—'],
      ['⭐ Level', '—'],
      ['🪙 Coins earned (all time)', '—']
    ];

    rows.forEach((r, i) => {
      const y = 130 + i * 42;
      this.add.text(W/2 - 200, y, r[0], { fontFamily: FONT, fontSize: '17px', color: '#3b2b20', fontStyle: 'bold' });
      this.add.text(W/2 + 200, y, r[1], { fontFamily: FONT, fontSize: '17px', color: '#c98a00', fontStyle: 'bold' }).setOrigin(1, 0);
    });

    // Golden Douglas Statue (proof of optional trophy frame)
    if (this.textures.exists('ui_trophy_gold')) {
      const frame = this.add.image(W/2, 370, 'ui_trophy_gold').setOrigin(0.5);
      frame.setDisplaySize(220, 260);
      frame.setInteractive({ useHandCursor: true });
      frame.on('pointerdown', () => {
        feel(this, 'golden_douglas', 'achievement');
      });
    } else {
      const statue = this.add.text(W/2, 370, '🐕✨ GOLDEN DOUGLAS STATUE ✨🐕', {
        fontFamily: FONT,
        fontSize: '20px',
        color: '#FFD23F',
        fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      statue.on('pointerdown', () => {
        feel(this, 'golden_douglas', 'achievement');
      });
    }

    this.add.text(W/2, H - 50, 'Tap to replay the legendary moment!', {
      fontFamily: FONT,
      fontSize: '18px',
      color: '#FFD23F'
    }).setOrigin(0.5);
  }
}