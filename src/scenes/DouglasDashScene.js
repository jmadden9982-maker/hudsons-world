import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';

export default class DouglasDashScene extends Phaser.Scene {
  constructor() {
    super('DouglasDashScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width: W, height: H } = this.scale;

    this.score = 0;
    this.isGameOver = false;

    this.add.rectangle(0, 0, W, H, 0x87CEEB).setOrigin(0);
    this.ground = this.add.rectangle(0, H - 60, W, 60, 0x228B22).setOrigin(0);
    this.physics.add.existing(this.ground, true);

    this.doug = this.add.rectangle(140, H - 130, 48, 60, 0x8B4513);
    this.physics.add.existing(this.doug);
    this.doug.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.doug, this.ground);

    this.scoreText = this.add.text(30, 30, 'Score: 0', { fontSize: '28px', color: '#ffffff', fontStyle: 'bold' });
    this.highScoreText = this.add.text(30, 70, 'Best: ' + SaveSystem.getHighScore(), { fontSize: '20px', color: '#FFD23F' });

    this.input.on('pointerdown', () => this.jump());

    this.obstacles = this.physics.add.group();
    this.collectibles = this.physics.add.group();

    this.time.addEvent({ delay: 1400, callback: this.spawnObstacle, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1100, callback: this.spawnCollectible, callbackScope: this, loop: true });

    this.physics.add.overlap(this.doug, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.doug, this.obstacles, this.hitObstacle, null, this);

    this.physics.world.gravity.y = 1100;
  }

  jump() {
    if (this.doug.body.touching.down && !this.isGameOver) {
      this.doug.body.setVelocityY(-620);
    }
  }

  spawnObstacle() {
    if (this.isGameOver) return;
    const ob = this.add.rectangle(this.scale.width + 40, this.scale.height - 95, 38, 38, 0x8B0000);
    this.physics.add.existing(ob);
    ob.body.setVelocityX(-260);
    ob.body.setAllowGravity(false);
    this.obstacles.add(ob);
  }

  spawnCollectible() {
    if (this.isGameOver) return;
    const item = this.add.circle(this.scale.width + 30, this.scale.height - 130, 14, 0x8B4513);
    this.physics.add.existing(item);
    item.body.setVelocityX(-240);
    item.body.setAllowGravity(false);
    item.setData('points', 10);
    this.collectibles.add(item);
  }

  collectItem(doug, item) {
    const points = item.getData('points') || 10;
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
    item.destroy();

    SaveSystem.addStars(points);
    AudioManager.playSfx('bone_collect');
  }

  hitObstacle() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.physics.pause();

    const newHigh = SaveSystem.setHighScore(this.score);
    this.highScoreText.setText('Best: ' + newHigh);

    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  update() {
    if (this.isGameOver) return;
    this.obstacles.children.iterate(ob => { if (ob && ob.x < -50) ob.destroy(); });
    this.collectibles.children.iterate(item => { if (item && item.x < -30) item.destroy(); });
  }
}