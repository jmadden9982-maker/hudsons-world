import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Sky background
    this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0);

    // Ground
    this.add.rectangle(0, height * 0.65, width, height * 0.35, 0x228B22).setOrigin(0);

    // Animated clouds
    for (let i = 0; i < 6; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(60, 220),
        Phaser.Math.Between(90, 160),
        45,
        0xffffff,
        0.9
      );

      this.tweens.add({
        targets: cloud,
        x: width + 200,
        duration: Phaser.Math.Between(18000, 32000),
        repeat: -1,
        onRepeat: () => {
          cloud.x = -200;
          cloud.y = Phaser.Math.Between(60, 220);
        }
      });
    }

    // Title with personality
    this.add.text(width / 2, 160, "HUDSON'S WORLD", {
      fontSize: '52px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 215, 'A Premium Adventure', {
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Douglas beside title (simple but charming)
    this.add.rectangle(width / 2 + 180, 175, 55, 45, 0x8B4513).setOrigin(0.5);
    this.add.text(width / 2 + 180, 175, '🐶', { fontSize: '32px' }).setOrigin(0.5);

    // Welcome message
    this.add.text(width / 2, 280, 'Welcome back, Hudson!', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Big Play Button with bounce
    const playBtn = this.add.text(width / 2, height / 2 + 80, '▶  PLAY', {
      fontSize: '42px',
      color: '#ffffff',
      backgroundColor: '#228B22',
      padding: { x: 70, y: 22 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: playBtn,
      scale: 1.05,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut'
    });

    playBtn.on('pointerdown', () => {
      this.scene.start('WorldMapScene');
    });

    // Quick nav row
    const navY = height - 110;
    const quickNav = [
      { label: '🗺️ Map', scene: 'WorldMapScene' },
      { label: '📖 Journal', scene: 'AdventureJournalScene' },
      { label: '🏠 House', scene: 'HudsonHouseScene' }
    ];

    quickNav.forEach((item, i) => {
      const x = 140 + i * 220;
      const btn = this.add.text(x, navY, item.label, {
        fontSize: '20px',
        color: '#FFD23F',
        backgroundColor: '#333333',
        padding: { x: 18, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', () => this.scene.start(item.scene));
    });

    // Star counter (placeholder for now)
    this.add.text(width - 40, 40, '⭐ 12', {
      fontSize: '22px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
  }
}