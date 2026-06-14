import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 50, "Hudson's World", {
      fontSize: '32px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const bar = this.add.rectangle(width / 2, height / 2 + 20, 300, 20, 0x333333);
    const progress = this.add.rectangle(width / 2 - 148, height / 2 + 20, 4, 16, 0xFFD23F).setOrigin(0, 0.5);

    this.load.on('progress', (value) => {
      progress.width = 292 * value;
    });

    this.load.on('complete', () => {
      this.scene.start('MainMenuScene');
    });

    this.time.delayedCall(800, () => {
      this.load.emit('complete');
    });
  }
}