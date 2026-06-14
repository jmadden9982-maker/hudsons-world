import Phaser from 'phaser';

export default class WorldMapScene extends Phaser.Scene {
  constructor() {
    super('WorldMapScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0);

    this.add.text(width / 2, 60, 'Adventure Map', {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const zones = [
      { name: 'Douglas Dash', scene: 'DouglasDashScene', color: 0x228B22 },
      { name: 'Hudson House', scene: 'HudsonHouseScene', color: 0x8B4513 },
      { name: 'Douglas Den', scene: 'DouglasDenScene', color: 0xD2691E },
      { name: 'Journal', scene: 'AdventureJournalScene', color: 0x4B0082 },
      { name: 'Photo Wall', scene: 'FamilyPhotoWallScene', color: 0xFF6347 },
      { name: 'Trophy Room', scene: 'TrophyRoomScene', color: 0xFFD700 },
      { name: 'Wardrobe', scene: 'WardrobeScene', color: 0x9370DB }
    ];

    zones.forEach((zone, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 180 + col * 360;
      const y = 180 + row * 140;

      const card = this.add.rectangle(x, y, 280, 100, zone.color).setInteractive({ useHandCursor: true });
      this.add.text(x, y, zone.name, {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      card.on('pointerdown', () => {
        this.scene.start(zone.scene);
      });
    });
  }
}