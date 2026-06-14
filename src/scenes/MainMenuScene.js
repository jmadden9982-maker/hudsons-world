import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 150, "HUDSON'S WORLD", {
      fontSize: '42px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Tap to Start', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start('WorldMapScene');
    });
  }
}