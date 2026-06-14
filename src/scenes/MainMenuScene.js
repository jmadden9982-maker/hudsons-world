import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient effect
    this.add.rectangle(0, 0, width, height, 0x1b1430).setOrigin(0);
    this.add.rectangle(0, height * 0.6, width, height * 0.4, 0x2E8B57).setOrigin(0);

    this.add.text(width / 2, 180, "HUDSON'S WORLD", {
      fontSize: '48px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 240, 'A Premium Adventure', {
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const playBtn = this.add.text(width / 2, height / 2 + 50, '▶ PLAY', {
      fontSize: '36px',
      color: '#ffffff',
      backgroundColor: '#228B22',
      padding: { x: 60, y: 20 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playBtn.on('pointerdown', () => {
      this.scene.start('WorldMapScene');
    });

    // Quick nav buttons
    const navY = height - 120;
    const navButtons = [
      { label: 'Map', scene: 'WorldMapScene' },
      { label: 'Journal', scene: 'AdventureJournalScene' },
      { label: 'House', scene: 'HudsonHouseScene' }
    ];

    navButtons.forEach((btn, i) => {
      const x = 150 + i * 200;
      const t = this.add.text(x, navY, btn.label, {
        fontSize: '20px',
        color: '#FFD23F',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      t.on('pointerdown', () => this.scene.start(btn.scene));
    });
  }
}