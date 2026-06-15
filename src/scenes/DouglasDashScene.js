import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';
import { sceneBg, makeDouglasSprite, gameButton, COL } from '../ui/kit.js';

export default class DouglasDashScene extends Phaser.Scene {
  constructor() {
    super('DouglasDashScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width: W, height: H } = this.scale;

    this.score = 0;
    this.isGameOver = false;

    // Painted sky background if committed, else the original flat colour.
    if (this.textures.exists('bg_dash')) sceneBg(this, 'bg_dash', 0x87CEEB, 0xBFE9FF);
    else this.add.rectangle(0, 0, W, H, 0x87CEEB).setOrigin(0);

    this.ground = this.add.rectangle(0, H - 60, W, 60, 0x228B22).setOrigin(0);
    this.physics.add.existing(this.ground, true);

    // Physics body stays a reliable rectangle; if the sheet loaded we hide it and
    // sync a visible Douglas sprite to it each frame (see update()).
    this.doug = this.add.rectangle(140, H - 130, 48, 60, 0x8B4513);
    this.physics.add.existing(this.doug);
    this.doug.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.doug, this.ground);

    this.dougSprite = makeDouglasSprite(this, this.doug.x, this.doug.y, 'douglas_run');
    if (this.dougSprite) {
      this.dougSprite.setScale(0.44).setDepth(5);
      this.doug.setVisible(false);
    }

    // Score with a dark outline + shadow so it stays readable over any background.
    this.scoreText = this.add.text(30, 28, 'Score: 0', { fontSize: '28px', color: '#ffffff', fontStyle: 'bold' })
      .setStroke('#1b1430', 6).setShadow(0, 2, '#000000', 4).setDepth(50);
    this.highScoreText = this.add.text(30, 66, 'Best: ' + SaveSystem.getHighScore(), { fontSize: '20px', color: '#FFD23F' })
      .setStroke('#1b1430', 5).setShadow(0, 2, '#000000', 4).setDepth(50);

    this.input.on('pointerdown', () => this.jump());

    this.obstacles = this.physics.add.group();
    this.collectibles = this.physics.add.group();

    this.time.addEvent({ delay: 1400, callback: this.spawnObstacle, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1100, callback: this.spawnCollectible, callbackScope: this, loop: true });

    this.physics.add.overlap(this.doug, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.doug, this.obstacles, this.hitObstacle, null, this);

    this.physics.world.gravity.y = 1100;

    // Compact back button in the top-right — away from the bottom-left player and the score.
    gameButton(this, W - 86, 44, 132, 52, '⬅ Back', COL.wood, () => this.scene.start('WorldMapScene')).setDepth(130);
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
    // Keep the visible sprite locked onto the physics body (nudged up so feet meet the ground).
    if (this.dougSprite) { this.dougSprite.x = this.doug.x; this.dougSprite.y = this.doug.y - 8; }
    if (this.isGameOver) return;
    this.obstacles.children.iterate(ob => { if (ob && ob.x < -50) ob.destroy(); });
    this.collectibles.children.iterate(item => { if (item && item.x < -30) item.destroy(); });
  }
}