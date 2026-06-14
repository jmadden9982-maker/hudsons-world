import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { sceneBg } from '../ui/kit.js';

export default class WorldMapScene extends Phaser.Scene {
  constructor() {
    super('WorldMapScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width, height } = this.scale;

    if (this.textures.exists('bg_worldmap')) {
      sceneBg(this, 'bg_worldmap', 0x87CEEB, 0xBFE9FF);
    } else {
      this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0);
      this.add.rectangle(0, height * 0.7, width, height * 0.3, 0x228B22).setOrigin(0);
    }

    this.add.text(width / 2, 55, 'Adventure Map', { fontSize: '36px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

    const zones = [
      { name: 'Douglas Dash', emoji: '🐕', scene: 'DouglasDashScene', x: 200, y: 220, color: 0x228B22 },
      { name: 'Hudson House', emoji: '🏠', scene: 'HudsonHouseScene', x: 520, y: 220, color: 0x8B4513 },
      { name: 'Douglas Den', emoji: '🦴', scene: 'DouglasDenScene', x: 360, y: 380, color: 0xD2691E },
      { name: 'Journal', emoji: '📖', scene: 'AdventureJournalScene', x: 200, y: 540, color: 0x4B0082 },
      { name: 'Photo Wall', emoji: '📸', scene: 'FamilyPhotoWallScene', x: 520, y: 540, color: 0xFF6347 },
      { name: 'Trophy Room', emoji: '🏆', scene: 'TrophyRoomScene', x: 200, y: 700, color: 0xFFD700 },
      { name: 'Wardrobe', emoji: '👕', scene: 'WardrobeScene', x: 520, y: 700, color: 0x9370DB }
    ];

    zones.forEach(zone => {
      const card = this.add.rectangle(zone.x, zone.y, 240, 100, zone.color).setInteractive({ useHandCursor: true });
      this.add.text(zone.x, zone.y - 15, zone.emoji + ' ' + zone.name, { fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

      card.on('pointerdown', () => {
        AudioManager.playSfx('button_click');
        this.tweens.add({ targets: card, scaleX: 0.92, scaleY: 0.92, duration: 80, yoyo: true });
        this.scene.start(zone.scene);
      });
    });

    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xffffff, 0.6);
    graphics.lineBetween(320, 270, 360, 330);
    graphics.lineBetween(440, 330, 360, 430);
    graphics.lineBetween(320, 590, 360, 650);
    graphics.lineBetween(440, 650, 360, 750);
  }
}