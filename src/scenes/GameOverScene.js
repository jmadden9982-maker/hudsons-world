import Phaser from 'phaser';
export default class GameOverScene extends Phaser.Scene { constructor() { super('GameOverScene'); } create() { this.scene.start('WorldMapScene'); } }
