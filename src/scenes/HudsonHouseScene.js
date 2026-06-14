import Phaser from 'phaser';

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() {
    super('HudsonHouseScene');
  }

  create() {
    const { width, height } = this.scale;

    // Room
    this.add.rectangle(0, 0, width, height, 0xFFF1DA).setOrigin(0);
    this.add.rectangle(0, height - 90, width, 90, 0x8B4513).setOrigin(0);

    this.add.text(width / 2, 50, 'Hudson House', {
      fontSize: '36px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === DAILY REWARD CHEST (Main Feature) ===
    const chest = this.add.rectangle(width / 2, 280, 160, 120, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 280, '🎁 Daily Chest', {
      fontSize: '22px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Wiggle + glow effect
    this.tweens.add({
      targets: chest,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    chest.on('pointerdown', () => {
      this.openDailyChest();
    });

    // Other interactive objects
    const toyBox = this.add.rectangle(160, 420, 120, 70, 0x4169E1).setInteractive({ useHandCursor: true });
    this.add.text(160, 420, '🧸 Toys', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    toyBox.on('pointerdown', () => {
      this.add.text(160, 380, 'Toys everywhere!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(700, () => this.scene.start('WorldMapScene'));
    });

    const bed = this.add.rectangle(width / 2, 520, 200, 70, 0xFF69B4).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 520, '🛏️ Bed', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    bed.on('pointerdown', () => {
      this.add.text(width / 2, 480, 'Boing!', { fontSize: '20px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(700, () => this.scene.start('WorldMapScene'));
    });

    const douglas = this.add.rectangle(width - 160, 480, 80, 70, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width - 160, 480, '🐕 Douglas', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);

    douglas.on('pointerdown', () => {
      this.add.text(width - 160, 440, 'Tail wag!', { fontSize: '18px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(700, () => this.scene.start('WorldMapScene'));
    });

    this.add.text(width / 2, height - 45, 'Open the Daily Chest!', {
      fontSize: '20px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  openDailyChest() {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0).setInteractive();

    this.add.text(width / 2, height / 2 - 60, '🎁 Daily Reward!', {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, '⭐ +25 Stars', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Sparkle effect
    this.add.particles(width / 2, height / 2 - 20, 'particle_sparkle', {
      speed: { min: 50, max: 120 },
      scale: { start: 0.6, end: 0 },
      lifespan: 800
    }).explode(12);

    const claimBtn = this.add.text(width / 2, height / 2 + 100, 'Claim Reward', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#228B22',
      padding: { x: 40, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    claimBtn.on('pointerdown', () => {
      overlay.destroy();
      claimBtn.destroy();
      this.add.text(width / 2, height / 2 + 60, 'Thanks! Come back tomorrow!', {
        fontSize: '20px',
        color: '#FFD23F'
      }).setOrigin(0.5);

      this.time.delayedCall(1200, () => this.scene.start('WorldMapScene'));
    });
  }
}