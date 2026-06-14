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

    // Daily Reward Chest
    this.chest = this.add.rectangle(width / 2, 260, 150, 110, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 260, '🎁 Daily Chest', {
      fontSize: '20px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.chest,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    this.chest.on('pointerdown', () => this.openDailyChest());

    // === BABY BELL HIDE & SEEK ===
    const spots = [
      { x: 160, y: 380, label: '🧸 Toy Box' },
      { x: width / 2, y: 480, label: '🛏️ Under Bed' },
      { x: width - 160, y: 380, label: '🪟 Window Sill' }
    ];

    const hiddenSpot = Phaser.Math.RND.pick(spots);

    spots.forEach(spot => {
      const obj = this.add.rectangle(spot.x, spot.y, 110, 65, 0x696969).setInteractive({ useHandCursor: true });
      this.add.text(spot.x, spot.y, spot.label, { fontSize: '16px', color: '#fff' }).setOrigin(0.5);

      obj.on('pointerdown', () => {
        if (spot.x === hiddenSpot.x && spot.y === hiddenSpot.y) {
          this.triggerBabyBellFound(spot);
        } else {
          // Wrong spot - gentle feedback
          const msg = this.add.text(spot.x, spot.y - 40, 'Not here...', {
            fontSize: '16px',
            color: '#aaaaaa'
          }).setOrigin(0.5);
          this.tweens.add({
            targets: msg,
            alpha: 0,
            duration: 500,
            onComplete: () => msg.destroy()
          });
        }
      });
    });

    // Douglas
    const douglas = this.add.rectangle(width - 140, 520, 70, 55, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width - 140, 520, '🐕 Douglas', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    douglas.on('pointerdown', () => this.scene.start('WorldMapScene'));

    this.add.text(width / 2, height - 45, 'Find Baby Bell! 🐱', {
      fontSize: '20px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  triggerBabyBellFound(spot) {
    // Brief pause feel
    this.time.delayedCall(180, () => {
      // Baby Bell pop animation
      const bell = this.add.text(spot.x, spot.y - 30, '🐱', { fontSize: '42px' }).setOrigin(0.5);

      // Bounce + small spin + wiggle
      this.tweens.add({
        targets: bell,
        y: spot.y - 90,
        angle: { from: -15, to: 15 },
        duration: 280,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.tweens.add({
            targets: bell,
            y: spot.y - 50,
            duration: 180,
            ease: 'Bounce.easeOut'
          });
        }
      });

      // MEOW! text
      const meow = this.add.text(spot.x, spot.y - 110, 'MEOW!', {
        fontSize: '28px',
        color: '#FFD23F',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.tweens.add({
        targets: meow,
        scale: 1.3,
        duration: 200,
        yoyo: true,
        onComplete: () => meow.destroy()
      });

      // Sparkles
      this.add.particles(spot.x, spot.y - 60, 'particle_sparkle', {
        speed: { min: 40, max: 100 },
        scale: { start: 0.5, end: 0 },
        lifespan: 600
      }).explode(12);

      // Reward stars rising
      const reward = this.add.text(spot.x, spot.y - 70, '+10 ⭐', {
        fontSize: '20px',
        color: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.tweens.add({
        targets: reward,
        y: spot.y - 160,
        scale: 1.15,
        duration: 550,
        ease: 'Back.easeOut',
        onComplete: () => {
          SaveSystem.addStars(10);
          reward.destroy();
          bell.destroy();
          this.scene.start('WorldMapScene');
        }
      });
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

    this.tweens.add({
      targets: this.chest,
      scaleX: 0.85,
      scaleY: 1.15,
      duration: 120,
      yoyo: true,
      onComplete: () => {
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