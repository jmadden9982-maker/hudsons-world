import Phaser from 'phaser';
import SaveSystem from '../systems/SaveSystem.js';

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
    this.chest = this.add.rectangle(width / 2, 260, 150, 110, 0x8B4513).setInteractive({ useHandCursor: true });
    this.chestLabel = this.add.text(width / 2, 260, '🎁 Daily Chest', {
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Idle wiggle + glow pulse
    this.startChestIdleAnimation();

    this.chest.on('pointerdown', () => this.openDailyChest());

    // Other interactive objects (kept simple)
    const toyBox = this.add.rectangle(160, 420, 120, 70, 0x4169E1).setInteractive({ useHandCursor: true });
    this.add.text(160, 420, '🧸 Toys', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    toyBox.on('pointerdown', () => this.scene.start('WorldMapScene'));

    const bed = this.add.rectangle(width / 2, 520, 200, 70, 0xFF69B4).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 520, '🛏️ Bed', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
    bed.on('pointerdown', () => this.scene.start('WorldMapScene'));

    const douglas = this.add.rectangle(width - 140, 520, 70, 55, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width - 140, 520, '🐕 Douglas', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    douglas.on('pointerdown', () => this.scene.start('WorldMapScene'));

    this.add.text(width / 2, height - 45, 'Open the Daily Chest!', {
      fontSize: '20px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  startChestIdleAnimation() {
    // Gentle wiggle
    this.tweens.add({
      targets: this.chest,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    // Occasional sparkle
    this.time.addEvent({
      delay: 4500,
      callback: () => {
        if (this.chest && this.chest.active) {
          this.add.particles(this.chest.x, this.chest.y - 30, 'particle_sparkle', {
            speed: { min: 20, max: 50 },
            scale: { start: 0.3, end: 0 },
            lifespan: 600
          }).explode(4);
        }
      },
      loop: true
    });
  }

  openDailyChest() {
    const today = new Date().toISOString().split('T')[0];
    const lastClaim = SaveSystem.getLastDailyReward();

    if (lastClaim === today) {
      this.add.text(this.scale.width / 2, 180, 'Already claimed today!', { fontSize: '20px', color: '#ff0000' }).setOrigin(0.5);
      return;
    }

    SaveSystem.setLastDailyReward(today);
    SaveSystem.addStars(25);

    // Opening animation
    this.tweens.add({
      targets: this.chest,
      scaleX: 0.85,
      scaleY: 1.15,
      duration: 120,
      yoyo: true,
      onComplete: () => {
        // Golden flash + reward popup
        this.add.particles(this.chest.x, this.chest.y, 'particle_sparkle', {
          speed: { min: 60, max: 140 },
          scale: { start: 0.6, end: 0 },
          lifespan: 700
        }).explode(14);

        const popup = this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, '🎁 +25 Stars!', {
          fontSize: '32px',
          color: '#FFD700',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
          targets: popup,
          y: this.scale.height / 2 - 120,
          scale: 1.1,
          duration: 600,
          ease: 'Back.easeOut'
        });

        this.time.delayedCall(1400, () => {
          popup.destroy();
          this.scene.start('WorldMapScene');
        });
      }
    });
  }
}