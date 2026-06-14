import Phaser from 'phaser';
import { feel } from '../systems/feel.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }

  create() {
    const { width: W, height: H } = this.scale;

    this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);

    this.add.text(W/2, 50, '🏆 Trophy Room', {
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Golden Douglas Statue (proof of optional trophy frame)
    if (this.textures.exists('ui_trophy_gold')) {
      const frame = this.add.image(W/2, 280, 'ui_trophy_gold').setOrigin(0.5);
      frame.setDisplaySize(200, 240);
      frame.setInteractive({ useHandCursor: true });
      frame.on('pointerdown', () => {
        feel(this, 'golden_douglas', 'achievement');
      });
    } else {
      const statue = this.add.text(W/2, 280, '🐕✨ GOLDEN DOUGLAS STATUE ✨🐕', {
        fontSize: '22px',
        color: '#FFD23F',
        fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      statue.on('pointerdown', () => {
        feel(this, 'golden_douglas', 'achievement');
      });
    }

    this.add.text(W/2, H - 60, 'Proof of optional UI asset loading', {
      fontSize: '16px',
      color: '#FFE9C9'
    }).setOrigin(0.5);
  }
}