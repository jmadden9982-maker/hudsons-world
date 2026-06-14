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

    // Baby Bell spots
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
        if (spot.x === hiddenSpot.x) {
          SaveSystem.incrementBabyBellCount();
          this.add.text(spot.x, spot.y - 50, '🐱 MEOW!', { fontSize: '24px', color: '#FFD23F' }).setOrigin(0.5);
          this.time.delayedCall(800, () => this.scene.start('WorldMapScene'));
        } else {
          this.add.text(spot.x, spot.y - 40, 'Not here...', { fontSize: '16px', color: '#aaa' }).setOrigin(0.5);
          this.time.delayedCall(600, () => this.scene.start('WorldMapScene'));
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

  openDailyChest() {
    const today = new Date().toISOString().split('T')[0];
    const lastClaim = SaveSystem.getLastDailyReward();

    if (lastClaim === today) {
      this.add.text(this.scale.width / 2, 180, 'Already claimed today!', { fontSize: '20px', color: '#ff0000' }).setOrigin(0.5);
      return;
    }

    SaveSystem.setLastDailyReward(today);
    SaveSystem.addStars(25);

    // Simple claim popup
    const popup = this.add.text(this.scale.width / 2, this.scale.height / 2, '🎁 +25 Stars!', {
      fontSize: '28px',
      color: '#FFD700'
    }).setOrigin(0.5);

    this.time.delayedCall(1200, () => {
      popup.destroy();
      this.scene.start('WorldMapScene');
    });
  }
}