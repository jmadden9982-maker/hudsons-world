import Phaser from 'phaser';

export default class FamilyPhotoWallScene extends Phaser.Scene {
  constructor() {
    super('FamilyPhotoWallScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x3E2723).setOrigin(0);

    this.add.text(width / 2, 45, '📸 Family Photo Wall', {
      fontSize: '28px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 80, 'Memories Found: 4 / 12', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Photo data
    const photos = [
      { id: 1, title: 'Hudson & Douglas', unlocked: true, color: 0xFFCC80 },
      { id: 2, title: 'Family Day Out', unlocked: true, color: 0x81D4FA },
      { id: 3, title: 'Finley Playing', unlocked: true, color: 0xCE93D8 },
      { id: 4, title: 'Aimee & Hudson', unlocked: true, color: 0xA5D6A7 },
      { id: 5, title: 'Special Moment', unlocked: false },
      { id: 6, title: 'Holiday Memory', unlocked: false }
    ];

    photos.forEach((photo, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 180 + col * 360;
      const y = 160 + row * 200;

      if (photo.unlocked) {
        // Unlocked Polaroid
        const frame = this.add.rectangle(x, y, 260, 160, 0xffffff).setInteractive({ useHandCursor: true });
        this.add.rectangle(x, y - 10, 240, 120, photo.color);
        this.add.text(x, y + 50, photo.title, {
          fontSize: '18px',
          color: '#3b2b20',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        frame.on('pointerdown', () => this.showBigPhoto(photo));
      } else {
        // Locked photo
        const frame = this.add.rectangle(x, y, 260, 160, 0x757575).setInteractive({ useHandCursor: true });
        this.add.text(x, y, '🔒 Locked', {
          fontSize: '22px',
          color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(x, y + 35, 'Keep exploring!', {
          fontSize: '16px',
          color: '#eeeeee'
        }).setOrigin(0.5);

        frame.on('pointerdown', () => {
          this.add.text(x, y + 70, 'Locked!', { fontSize: '16px', color: '#FFD23F' }).setOrigin(0.5);
          this.time.delayedCall(600, () => this.scene.start('WorldMapScene'));
        });
      }
    });
  }

  showBigPhoto(photo) {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0).setInteractive();

    // Enlarged Polaroid
    this.add.rectangle(width / 2, height / 2, 380, 320, 0xffffff).setOrigin(0.5);
    this.add.rectangle(width / 2, height / 2 - 20, 340, 220, 0x81D4FA);

    this.add.text(width / 2, height / 2 + 80, photo.title, {
      fontSize: '26px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 120, 'Unlocked!', {
      fontSize: '18px',
      color: '#4CAF50'
    }).setOrigin(0.5);

    // Close button
    const closeBtn = this.add.text(width / 2, height - 100, 'Close', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#5BA838',
      padding: { x: 40, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      closeBtn.destroy();
      this.scene.restart();
    });

    overlay.on('pointerdown', () => {
      overlay.destroy();
      closeBtn.destroy();
      this.scene.restart();
    });
  }
}