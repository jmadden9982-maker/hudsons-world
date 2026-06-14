import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0);
    this.add.rectangle(0, height * 0.65, width, height * 0.35, 0x228B22).setOrigin(0);

    this.add.text(width / 2, 160, "HUDSON'S WORLD", { fontSize: '52px', color: '#FFD23F', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, 215, 'A Premium Adventure', { fontSize: '22px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width / 2, 280, 'Welcome back, Hudson!', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);

    const playBtn = this.add.text(width / 2, height / 2 + 80, '▶  PLAY', {
      fontSize: '42px', color: '#ffffff', backgroundColor: '#228B22', padding: { x: 70, y: 22 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.addButtonPressAnimation(playBtn);
    playBtn.on('pointerdown', () => {
      AudioManager.playSfx('button_confirm');
      this.scene.start('WorldMapScene');
    });

    const quickNav = [
      { label: '🗺️ Map', scene: 'WorldMapScene' },
      { label: '📖 Journal', scene: 'AdventureJournalScene' },
      { label: '🏠 House', scene: 'HudsonHouseScene' }
    ];

    quickNav.forEach((item, i) => {
      const x = 140 + i * 220;
      const btn = this.add.text(x, height - 110, item.label, { fontSize: '20px', color: '#FFD23F', backgroundColor: '#333333', padding: { x: 18, y: 10 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      this.addButtonPressAnimation(btn);
      btn.on('pointerdown', () => {
        AudioManager.playSfx('button_click');
        this.scene.start(item.scene);
      });
    });

    this.add.text(width - 40, 40, '⭐ 12', { fontSize: '22px', color: '#FFD23F', fontStyle: 'bold' }).setOrigin(1, 0);
  }

  addButtonPressAnimation(btn) {
    btn.on('pointerdown', () => {
      this.tweens.add({ targets: btn, scaleX: 0.92, scaleY: 0.92, duration: 80, yoyo: true, ease: 'Back.easeOut' });
    });
  }
}