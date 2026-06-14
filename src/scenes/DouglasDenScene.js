import Phaser from 'phaser';

export default class DouglasDenScene extends Phaser.Scene {
  constructor() { super('DouglasDenScene'); }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xF5DEB3).setOrigin(0);

    this.add.text(width / 2, 80, 'Douglas Den', {
      fontSize: '36px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Douglas representation
    this.doug = this.add.rectangle(width / 2, height / 2 - 50, 120, 100, 0x8B4513).setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height / 2 + 80, 'Douglas', {
      fontSize: '24px',
      color: '#3b2b20'
    }).setOrigin(0.5);

    // Buttons
    const buttons = [
      { label: 'Pet Douglas', y: height / 2 + 160, color: 0xFF69B4 },
      { label: 'Give Treat', y: height / 2 + 240, color: 0x32CD32 }
    ];

    buttons.forEach(btn => {
      const b = this.add.rectangle(width / 2, btn.y, 300, 60, btn.color).setInteractive({ useHandCursor: true });
      this.add.text(width / 2, btn.y, btn.label, {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      b.on('pointerdown', () => {
        this.add.text(width / 2, btn.y - 40, 'Douglas is happy!', {
          fontSize: '20px',
          color: '#FFD23F'
        }).setOrigin(0.5);
        this.time.delayedCall(1000, () => this.scene.start('WorldMapScene'));
      });
    });
  }
}