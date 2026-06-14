import Phaser from 'phaser';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }
  create() {
    const { width, height } = this.scale;
    this.add.text(width/2, 100, 'Trophy Room', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    this.add.text(width/2, height/2, 'Tap to return to Map', { fontSize: '24px', color: '#FFD23F' }).setOrigin(0.5);
    this.input.on('pointerdown', () => this.scene.start('WorldMapScene'));
  }
}