import Phaser from 'phaser';

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() {
    super('HudsonHouseScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xFFF1DA).setOrigin(0);
    this.add.rectangle(0, height - 90, width, 90, 0x8B4513).setOrigin(0);

    this.add.text(width / 2, 50, 'Hudson House', {
      fontSize: '36px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === DAILY REWARD CHEST ===
    const chest = this.add.rectangle(width / 2, 260, 150, 110, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 260, '🎁 Daily Chest', {
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: chest,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 1100,
      yoyo: true,
      repeat: -1
    });

    chest.on('pointerdown', () => this.openDailyChest());

    // === BABY BELL HIDE & SEEK ===
    const babyBellSpots = [
      { x: 160, y: 380, label: '🧸 Toy Box' },
      { x: width / 2, y: 480, label: '🛏️ Under Bed' },
      { x: width - 160, y: 380, label: '🪟 Window Sill' }
    ];

    // Randomly pick one spot to hide Baby Bell
    const hiddenSpot = Phaser.Math.RND.pick(babyBellSpots);

    babyBellSpots.forEach(spot => {
      const obj = this.add.rectangle(spot.x, spot.y, 110, 65, 0x696969).setInteractive({ useHandCursor: true });
      this.add.text(spot.x, spot.y, spot.label, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

      obj.on('pointerdown', () => {
        if (spot.x === hiddenSpot.x && spot.y === hiddenSpot.y) {
          // Found Baby Bell!
          this.add.text(spot.x, spot.y - 50, '🐱 MEOW!', {
            fontSize: '24px',
            color: '#FFD23F',
            fontStyle: 'bold'
          }).setOrigin(0.5);

          this.add.particles(spot.x, spot.y, 'particle_sparkle', {
            speed: { min: 40, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 600
          }).explode(10);

          this.time.delayedCall(900, () => this.scene.start('WorldMapScene'));
        } else {
          this.add.text(spot.x, spot.y - 40, 'Not here...', { fontSize: '16px', color: '#aaa' }).setOrigin(0.5);
          this.time.delayedCall(600, () => this.scene.start('WorldMapScene'));
        }
      });
    });

    // Douglas
    const douglas = this.add.rectangle(width - 140, 520, 70, 55, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width - 140, 520, '🐕 Douglas', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

    douglas.on('pointerdown', () => {
      this.add.text(width - 140, 480, 'Tail wag!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(700, () => this.scene.start('WorldMapScene'));
    });

    this.add.text(width / 2, height - 45, 'Find Baby Bell! 🐱', {
      fontSize: '20px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  openDailyChest() {
    const { width, height } = this.scale;
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setInteractive();

    this.add.text(width / 2, height / 2 - 50, '🎁 Daily Reward!', {
      fontSize: '30px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, '⭐ +25 Stars', {
      fontSize: '26px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.particles(width / 2, height / 2 - 10, 'particle_sparkle', {
      speed: { min: 50, max: 110 },
      scale: { start: 0.5, end: 0 },
      lifespan: 700
    }).explode(10);

    const claim = this.add.text(width / 2, height / 2 + 90, 'Claim', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#228B22',
      padding: { x: 40, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    claim.on('pointerdown', () => {
      overlay.destroy();
      claim.destroy();
      this.scene.start('WorldMapScene');
    });
  }
}