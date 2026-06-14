import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() {
    super('HudsonHouseScene');
  }

  create() {
    AudioManager.setScene(this);

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

    this.chest.on('pointerdown', () => {
      AudioManager.playSfx('button_confirm');
      this.openDailyChest();
    });

    // Baby Bell spots + other objects
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
        AudioManager.playSfx('button_click');
        if (spot.x === hiddenSpot.x && spot.y === hiddenSpot.y) {
          this.triggerBabyBellFound(spot);
        } else {
          const msg = this.add.text(spot.x, spot.y - 40, 'Not here...', { fontSize: '16px', color: '#aaaaaa' }).setOrigin(0.5);
          this.tweens.add({ targets: msg, alpha: 0, duration: 500, onComplete: () => msg.destroy() });
        }
      });
    });

    const douglas = this.add.rectangle(width - 140, 520, 70, 55, 0x8B4513).setInteractive({ useHandCursor: true });
    this.add.text(width - 140, 520, '🐕 Douglas', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    douglas.on('pointerdown', () => {
      AudioManager.playSfx('button_click');
      this.scene.start('WorldMapScene');
    });

    this.add.text(width / 2, height - 45, 'Find Baby Bell! 🐱', {
      fontSize: '20px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  triggerBabyBellFound(spot) { /* ... existing code ... */ }
  openDailyChest() { /* ... existing code ... */ }
}