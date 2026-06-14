import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';

export default class FamilyPhotoWallScene extends Phaser.Scene {
  constructor() {
    super('FamilyPhotoWallScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x3E2723).setOrigin(0);

    this.add.text(width / 2, 45, '📸 Family Photo Wall', {
      fontSize: '28px', color: '#FFD23F', fontStyle: 'bold' }).setOrigin(0.5);

    this.add.text(width / 2, 80, 'Memories Found: 4 / 12', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);

    const photos = [ /* existing photo data */ ];

    photos.forEach((photo, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 180 + col * 360;
      const y = 160 + row * 200;

      if (photo.unlocked) {
        const frame = this.add.rectangle(x, y, 260, 160, 0xffffff).setInteractive({ useHandCursor: true });
        this.add.rectangle(x, y - 10, 240, 120, photo.color);
        this.add.text(x, y + 50, photo.title, { fontSize: '18px', color: '#3b2b20', fontStyle: 'bold' }).setOrigin(0.5);

        frame.on('pointerdown', () => {
          AudioManager.playSfx('button_click');
          this.showBigPhoto(photo);
        });
      } else {
        const frame = this.add.rectangle(x, y, 260, 160, 0x757575).setInteractive({ useHandCursor: true });
        this.add.text(x, y, '🔒 Locked', { fontSize: '22px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(x, y + 35, 'Keep exploring!', { fontSize: '16px', color: '#eeeeee' }).setOrigin(0.5);

        frame.on('pointerdown', () => {
          AudioManager.playSfx('button_click');
          this.add.text(x, y + 70, 'Locked!', { fontSize: '16px', color: '#FFD23F' }).setOrigin(0.5);
          this.time.delayedCall(600, () => this.scene.start('WorldMapScene'));
        });
      }
    });
  }

  showBigPhoto(photo) { /* existing modal logic */ }
}