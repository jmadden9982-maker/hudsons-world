import Phaser from 'phaser';

export default class AdventureJournalScene extends Phaser.Scene {
  constructor() { super('AdventureJournalScene'); }
  create() {
    const { width, height } = this.scale;
    this.add.text(width/2, 100, 'Adventure Journal', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    this.add.text(width/2, height/2, 'Tap to return to Map', { fontSize: '24px', color: '#FFD23F' }).setOrigin(0.5);
    this.input.on('pointerdown', () => this.scene.start('WorldMapScene'));
  }
}