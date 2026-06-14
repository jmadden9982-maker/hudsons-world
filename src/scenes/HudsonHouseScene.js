import Phaser from 'phaser';

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() { super('HudsonHouseScene'); }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xFFF1DA).setOrigin(0);
    this.add.rectangle(0, height - 100, width, 100, 0x8B4513).setOrigin(0);

    this.add.text(width / 2, 80, 'Hudson House', {
      fontSize: '36px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const areas = [
      { name: 'Douglas Bed', y: 220, color: 0x8B4513 },
      { name: 'Photo Frames', y: 340, color: 0x4169E1 },
      { name: 'Baby Bell Spot', y: 460, color: 0x696969 },
      { name: 'Finley Toys', y: 580, color: 0xFF6347 }
    ];

    areas.forEach(area => {
      const box = this.add.rectangle(width / 2, area.y, 400, 80, area.color).setInteractive({ useHandCursor: true });
      this.add.text(width / 2, area.y, area.name, {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      box.on('pointerdown', () => {
        this.add.text(width / 2, area.y + 50, 'Nice!', { fontSize: '20px', color: '#FFD23F' }).setOrigin(0.5);
        this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
      });
    });

    this.add.text(width / 2, height - 50, 'Tap areas to interact • Tap to return', {
      fontSize: '18px',
      color: '#3b2b20'
    }).setOrigin(0.5);
  }
}