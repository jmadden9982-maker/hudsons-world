import Phaser from 'phaser';

export default class DouglasDashScene extends Phaser.Scene {
  constructor() {
    super('DouglasDashScene');
  }

  create() {
    const { width: W, height: H } = this.scale;

    this.score = 0;
    this.isGameOver = false;

    // Background
    this.add.rectangle(0, 0, W, H, 0x87CEEB).setOrigin(0);

    // Ground
    this.ground = this.add.rectangle(0, H - 80, W, 80, 0x228B22).setOrigin(0);
    this.physics.add.existing(this.ground, true);

    // Douglas (simple rectangle as placeholder)
    this.doug = this.add.rectangle(120, H - 140, 50, 60, 0x8B4513);
    this.physics.add.existing(this.doug);
    this.doug.body.setCollideWorldBounds(true);
    this.doug.body.setSize(40, 50);

    this.physics.add.collider(this.doug, this.ground);

    // Score text
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    // Instructions
    this.add.text(W / 2, 60, 'TAP TO JUMP', {
      fontSize: '24px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Obstacles group
    this.obstacles = this.physics.add.group();

    // Spawn obstacles
    this.time.addEvent({
      delay: 1500,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });

    // Input
    this.input.on('pointerdown', () => this.jump());

    // Collision
    this.physics.add.overlap(this.doug, this.obstacles, this.hitObstacle, null, this);

    this.physics.world.gravity.y = 1200;
  }

  jump() {
    if (this.doug.body.touching.down && !this.isGameOver) {
      this.doug.body.setVelocityY(-650);
    }
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    const obstacle = this.add.rectangle(this.scale.width + 50, this.scale.height - 110, 40, 40, 0x8B0000);
    this.physics.add.existing(obstacle);
    obstacle.body.setVelocityX(-300);
    obstacle.body.setAllowGravity(false);

    this.obstacles.add(obstacle);

    // Auto destroy
    this.time.delayedCall(5000, () => {
      if (obstacle && obstacle.destroy) obstacle.destroy();
    });
  }

  hitObstacle() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.physics.pause();
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  update() {
    if (this.isGameOver) return;

    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);

    // Clean up off-screen obstacles
    this.obstacles.children.iterate(ob => {
      if (ob && ob.x < -50) {
        ob.destroy();
      }
    });
  }
}