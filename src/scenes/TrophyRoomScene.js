import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, sceneBg, addBackButton } from '../ui/kit.js';
import { feel } from '../systems/feel.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }

  create() {
    AudioManager.setScene(this);
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_trophies')) sceneBg(this, 'bg_trophies', 0x6E4422, 0xB07B4F);
    else this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);

    // Only draw a scene title when there's no painted background (the art already names the room).
    if (!this.textures.exists('bg_trophies')) {
      this.add.text(W/2, 56, '🏆 Trophy Room', { fontSize: '28px', color: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5);
    }

    if (this.textures.exists('ui_trophy_gold')) {
      const frame = this.add.image(W/2, H/2 - 60, 'ui_trophy_gold').setOrigin(0.5);
      frame.setDisplaySize(168, 202);
      frame.setInteractive({ useHandCursor: true });
      frame.on('pointerdown', () => feel(this, 'legendary_chime', 'achievement'));
    } else {
      const statue = this.add.text(W/2, H/2 - 60, '🐕✨ GOLDEN DOUGLAS STATUE ✨🐕', {
        fontSize: '22px', color: '#FFD23F', fontStyle: 'bold', align: 'center', wordWrap: { width: W * 0.8 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      statue.on('pointerdown', () => feel(this, 'legendary_chime', 'achievement'));
    }

    this.add.text(W/2, H - 170, '✨ The Golden Douglas Trophy ✨', {
      fontFamily: FONT, fontSize: '18px', color: '#FFF6E0', fontStyle: 'bold'
    }).setOrigin(0.5);
    addBackButton(this);
  }
}