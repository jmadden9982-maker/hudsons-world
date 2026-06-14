import Phaser from 'phaser';

export default class DouglasDashScene extends Phaser.Scene {
  constructor() {
    super('DouglasDashScene');
    this.score = 0;
    this.highScore = 0;
    this.speed = 250;
    this.isGameOver = false;
  }

  create() {
    const { width: W, height: H } = this.scale;

    // Load high score
    this.highScore = parseInt(localStorage.getItem('douglasDashHighScore')) || 0;

    this.score = 0;
    this.isGameOver = false;
    this.speed = 250;

    // === PARALLAX BACKGROUND ===
    this.sky = this.add.rectangle(0, 0, W, H, 0x87CEEB).setOrigin(0);

    // Clouds
    this.clouds = this.add.group();
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(80, 280),
        Phaser.Math.Between(80, 140),
        40,
        0xffffff,
        0.85
      );
      this.clouds.add(cloud);
    }

    // Hills
    this.hills = this.add.tileSprite(0, H - 200, W, 120, 'hills').setOrigin(0).setTint(0x4CAF50);
    if (!this.textures.exists('hills')) {
      this.hills.setTexture(null);
      this.hills = this.add.rectangle(0, H - 200, W, 120, 0x4CAF50).setOrigin(0);
    }

    // Trees
    this.trees = this.add.tileSprite(0, H - 160, W, 80, 'trees').setOrigin(0).setTint(0x2E7D32);
    if (!this.textures.exists('trees')) {
      this.trees.setTexture(null);
      this.trees = this.add.rectangle(0, H - 160, W, 80, 0x2E7D32).setOrigin(0);
    }

    // Ground
    this.ground = this.add.tileSprite(0, H - 60, W, 60, 'ground').setOrigin(0).setTint(0x228B22);
    if (!this.textures.exists('ground')) {
      this.ground.setTexture(null);
      this.ground = this.add.rectangle(0, H - 60, W, 60, 0x228B22).setOrigin(0);
    }

    this.physics.add.existing(this.ground, true);

    // === DOUGLAS (Player) ===
    this.doug = this.add.rectangle(140, H - 130, 48, 60, 0x8B4513);
    this.physics.add.existing(this.doug);
    this.doug.body.setCollideWorldBounds(true);
    this.doug.body.setSize(40, 50);

    this.physics.add.collider(this.doug, this.ground);

    // === COLLECTIBLES ===
    this.collectibles = this.physics.add.group();

    // === OBSTACLES ===
    this.obstacles = this.physics.add.group();

    // Score
    this.scoreText = this.add.text(30, 30, 'Score: 0', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    });

    // High Score
    this.highScoreText = this.add.text(30, 70, 'Best: ' + this.highScore, {
      fontSize: '20px',
      color: '#FFD23F'
    });

    // Input
    this.input.on('pointerdown', () => this.jump());

    // Spawning
    this.time.addEvent({
      delay: 1400,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1100,
      callback: this.spawnCollectible,
      callbackScope: this,
      loop: true
    });

    // Collision
    this.physics.add.overlap(this.doug, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.doug, this.obstacles, this.hitObstacle, null, this);

    this.physics.world.gravity.y = 1100;

    // Speed increase
    this.time.addEvent({
      delay: 30000,
      callback: () => { this.speed += 40; },
      loop: true
    });
  }

  jump() {
    if (this.doug.body.touching.down && !this.isGameOver) {
      this.doug.body.setVelocityY(-620);
      // Simple landing dust effect
      this.add.particles(this.doug.x, this.doug.y + 30, 'particle_sparkle', {
        speed: { min: 30, max: 80 },
        scale: { start: 0.4, end: 0 },
        lifespan: 400
      }).explode(6);
    }
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    const obstacle = this.add.rectangle(this.scale.width + 40, this.scale.height - 95, 38, 38, 0x8B0000);
    this.physics.add.existing(obstacle);
    obstacle.body.setVelocityX(-this.speed);
    obstacle.body.setAllowGravity(false);
    this.obstacles.add(obstacle);

    this.time.delayedCall(6000, () => {
      if (obstacle && obstacle.active) obstacle.destroy();
    });
  }

  spawnCollectible() {
    if (this.isGameOver) return;

    const types = [
      { color: 0x8B4513, points: 10, label: 'bone' },
      { color: 0xFFD700, points: 25, label: 'ball' },
      { color: 0xFFD700, points: 100, label: 'golden' }
    ];

    const type = Phaser.Math.RND.pick(types);
    const y = this.scale.height - 120 - Phaser.Math.Between(0, 180);

    const item = this.add.circle(this.scale.width + 30, y, 14, type.color);
    this.physics.add.existing(item);
    item.body.setVelocityX(-this.speed * 0.95);
    item.body.setAllowGravity(false);
    item.setData('points', type.points);
    item.setData('type', type.label);

    this.collectibles.add(item);

    this.time.delayedCall(7000, () => {
      if (item && item.active) item.destroy();
    });
  }

  collectItem(doug, item) {
    const points = item.getData('points') || 10;
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);

    // Collection effect
    this.add.particles(item.x, item.y, 'particle_sparkle', {
      speed: { min: 40, max: 100 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500
    }).explode(8);

    item.destroy();

    // Simple sound feedback
    if (this.sound && this.sound.get('collect')) {
      this.sound.play('collect');
    }
  }

  hitObstacle() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.physics.pause();

    // Save high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('douglasDashHighScore', this.highScore);
    }

    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene', { 
        score: this.score, 
        highScore: this.highScore 
      });
    });
  }

  update(time, delta) {
    if (this.isGameOver) return;

    // Parallax scrolling
    if (this.hills && this.hills.tilePositionX !== undefined) this.hills.tilePositionX += this.speed * 0.3 * (delta / 1000);
    if (this.trees && this.trees.tilePositionX !== undefined) this.trees.tilePositionX += this.speed * 0.6 * (delta / 1000);
    if (this.ground && this.ground.tilePositionX !== undefined) this.ground.tilePositionX += this.speed * (delta / 1000);

    // Move clouds
    this.clouds.children.iterate(cloud => {
      if (cloud) {
        cloud.x -= 20 * (delta / 1000);
        if (cloud.x < -100) cloud.x = this.scale.width + 100;
      }
    });

    // Clean up objects
    this.obstacles.children.iterate(ob => {
      if (ob && ob.x < -50) ob.destroy();
    });

    this.collectibles.children.iterate(item => {
      if (item && item.x < -30) item.destroy();
    });
  }
}