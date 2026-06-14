import Phaser from 'phaser';

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() {
    super('HudsonHouseScene');
  }

  create() {
    const { width, height } = this.scale;

    // Room background
    this.add.rectangle(0, 0, width, height, 0xFFF1DA).setOrigin(0);
    this.add.rectangle(0, height - 90, width, 90, 0x8B4513).setOrigin(0);

    this.add.text(width / 2, 50, 'Hudson House', {
      fontSize: '36px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Toy Box
    const toyBox = this.add.rectangle(180, 320, 140, 90, 0x4169E1).setInteractive({ useHandCursor: true });
    this.add.text(180, 320, '🧸 Toy Box', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    toyBox.on('pointerdown', () => {
      this.add.text(180, 280, 'Toys everywhere!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(900, () => this.scene.start('WorldMapScene'));
    });

    // Bed
    const bed = this.add.rectangle(width / 2, 420, 220, 80, 0xFF69B4).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 420, '🛏️ Bed', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    bed.on('pointerdown', () => {
      this.add.text(width / 2, 380, 'Boing!', { fontSize: '22px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
    });

    // Window
    const windowObj = this.add.rectangle(width - 160, 280, 130, 100, 0x87CEEB).setInteractive({ useHandCursor: true });
    this.add.text(width - 160, 280, '🪟 Window', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    windowObj.on('pointerdown', () => {
      this.add.text(width - 160, 240, 'Daytime!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
    });

    // Douglas
    const douglas = this.add.rectangle(520, 520, 70, 60, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(520, 520, '🐕 Douglas', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    douglas.on('pointerdown', () => {
      this.add.text(520, 480, 'Tail wag!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
    });

    this.add.text(width / 2, height - 45, 'Tap things to interact', {
      fontSize: '18px',
      color: '#3b2b20'
    }).setOrigin(0.5);
  }
}