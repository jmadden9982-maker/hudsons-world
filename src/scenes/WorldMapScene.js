import Phaser from 'phaser';

export default class WorldMapScene extends Phaser.Scene {
  constructor() {
    super('WorldMapScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 80, 'Adventure Map', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const buttons = [
      { label: 'Douglas Dash', scene: 'DouglasDashScene' },
      { label: 'Hudson House', scene: 'HudsonHouseScene' },
      { label: 'Douglas Den', scene: 'DouglasDenScene' },
      { label: 'Journal', scene: 'AdventureJournalScene' },
      { label: 'Photo Wall', scene: 'FamilyPhotoWallScene' },
      { label: 'Trophy Room', scene: 'TrophyRoomScene' },
      { label: 'Wardrobe', scene: 'WardrobeScene' }
    ];

    buttons.forEach((btn, i) => {
      const y = 180 + i * 70;
      const text = this.add.text(width / 2, y, btn.label, {
        fontSize: '24px',
        color: '#FFD23F',
        backgroundColor: '#333333',
        padding: { x: 30, y: 12 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      text.on('pointerdown', () => {
        this.scene.start(btn.scene);
      });
    });
  }
}