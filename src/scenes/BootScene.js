import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  create() {
    this.input.addPointer(2);
    this.scene.start('PreloadScene');
  }
}
