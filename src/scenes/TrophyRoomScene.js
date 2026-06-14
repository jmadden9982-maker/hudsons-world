import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { S } from '../systems/state.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() {
    super('TrophyRoomScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width: W, height: H } = this.scale;

    const hasArt = this.textures.exists('bg_trophies');
    if (hasArt) {
      const bg = this.add.image(W / 2, H / 2, 'bg_trophies');
      const sc = Math.max(W / bg.width, H / bg.height);
      bg.setScale(sc);
    } else {
      this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);
    }

    this.add.text(W / 2, 50, '🏆 Trophy Room', {
      fontFamily: FONT,
      fontSize: '28px',
      color: '#FFE9C9',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const rows = [
      ['🏃 Douglas Dash best', S.best.dash + 'm'],
      ['🎃 Pumpkin Smash best', S.best.pumpkin + ' pts'],
      ['🚀 Space Rescue best', S.best.space + ' pts'],
      ['🏆 Critter Cards', S.cards.length + ' found'],
      ['⭐ Level', S.level + ' / 10'],
      ['🪙 Coins earned (all time)', S.lifetime]
    ];

    rows.forEach((r, i) => {
      const y = 130 + i * 42;
      this.add.text(W / 2 - 200, y, r[0], {
        fontFamily: FONT,
        fontSize: '17px',
        color: '#3b2b20',
        fontStyle: 'bold'
      });
      this.add.text(W / 2 + 200, y, '' + r[1], {
        fontFamily: FONT,
        fontSize: '17px',
        color: '#c98a00',
        fontStyle: 'bold'
      }).setOrigin(1, 0);
    });

    if (S.kingdom) {
      // === SAFE OPTIONAL: Use gold trophy frame if available ===
      if (this.textures.exists('ui_trophy_gold')) {
        const frame = this.add.image(W / 2, 370, 'ui_trophy_gold').setOrigin(0.5);
        frame.setDisplaySize(220, 260);
        frame.setInteractive({ useHandCursor: true });
        frame.on('pointerdown', () => {
          feel(this, 'golden_douglas', 'achievement');
          if (typeof RewardJuice !== 'undefined') {
            RewardJuice.confetti(this, W / 2, 370);
          }
        });
      } else {
        // Fallback text
        const statue = this.add.text(W / 2, 370, '🐕✨ GOLDEN DOUGLAS STATUE ✨🐕', {
          fontFamily: FONT,
          fontSize: '20px',
          color: '#FFD23F',
          fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        statue.on('pointerdown', () => {
          feel(this, 'golden_douglas', 'achievement');
          if (typeof RewardJuice !== 'undefined') {
            RewardJuice.confetti(this, W / 2, 370);
          }
        });
      }
    } else {
      const locked = this.add.text(W / 2, 370, '🔒 Golden Douglas Statue — Reach Kingdom', {
        fontFamily: FONT,
        fontSize: '18px',
        color: '#FFE9C9'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      locked.on('pointerdown', () => {
        feel(this, 'button_click', 'soft');
      });
    }

    this.add.text(W / 2, H - 50, S.kingdom ? 'Tap to replay the legendary moment!' : 'Keep exploring...', {
      fontFamily: FONT,
      fontSize: '18px',
      color: '#FFD23F'
    }).setOrigin(0.5);
  }
}