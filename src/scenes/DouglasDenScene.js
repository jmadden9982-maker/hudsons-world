import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';

export default class DouglasDenScene extends Phaser.Scene {
  constructor() {
    super('DouglasDenScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xF5DEB3).setOrigin(0);

    this.add.text(width / 2, 55, 'Douglas Den', {
      fontSize: '36px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const douglas = this.add.rectangle(width / 2, height / 2 - 30, 110, 90, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height / 2 + 50, 'Douglas', { fontSize: '24px', color: '#3b2b20' }).setOrigin(0.5);

    douglas.on('pointerdown', () => {
      AudioManager.playSfx('douglas_happy');
      this.add.text(width / 2, height / 2 - 80, 'Douglas is happy!', { fontSize: '20px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(900, () => this.scene.start('WorldMapScene'));
    });

    const petBtn = this.add.rectangle(width / 2 - 160, height / 2 + 160, 160, 60, 0xFF69B4).setInteractive({ useHandCursor: true });
    this.add.text(width / 2 - 160, height / 2 + 160, 'Pet Douglas', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    petBtn.on('pointerdown', () => {
      AudioManager.playSfx('douglas_happy');
      this.add.text(width / 2 - 160, height / 2 + 110, 'Good boy!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
    });

    const treatBtn = this.add.rectangle(width / 2 + 160, height / 2 + 160, 160, 60, 0x32CD32).setInteractive({ useHandCursor: true });
    this.add.text(width / 2 + 160, height / 2 + 160, 'Give Treat', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    treatBtn.on('pointerdown', () => {
      AudioManager.playSfx('douglas_bark');
      this.add.text(width / 2 + 160, height / 2 + 110, 'Yummy!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
    });

    this.add.text(width / 2, height - 50, 'Douglas loves attention', {
      fontSize: '18px',
      color: '#3b2b20'
    }).setOrigin(0.5);
  }
}