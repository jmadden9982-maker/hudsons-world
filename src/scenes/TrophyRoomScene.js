import Phaser from 'phaser';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() {
    super('TrophyRoomScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x3E2723).setOrigin(0);

    this.add.text(width / 2, 50, 'Trophy Room', {
      fontSize: '36px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Golden Douglas Statue (center)
    const statue = this.add.rectangle(width / 2, 220, 120, 140, 0xFFD700).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 220, '🐕✨', { fontSize: '48px' }).setOrigin(0.5);
    this.add.text(width / 2, 300, 'Golden Douglas', {
      fontSize: '18px',
      color: '#FFD700'
    }).setOrigin(0.5);

    statue.on('pointerdown', () => {
      this.add.text(width / 2, 360, 'Legendary!', { fontSize: '20px', color: '#FFD700' }).setOrigin(0.5);
      this.time.delayedCall(900, () => this.scene.start('WorldMapScene'));
    });

    // Achievement list
    const achievements = [
      { name: 'First Jump', frame: 0xCD7F32 },
      { name: 'First Bone', frame: 0xCD7F32 },
      { name: 'Score 100', frame: 0xC0C0C0 },
      { name: 'Score 500', frame: 0xFFD700 },
      { name: 'Pet Douglas 10x', frame: 0xC0C0C0 },
      { name: 'House Explorer', frame: 0xCD7F32 }
    ];

    achievements.forEach((ach, i) => {
      const y = 420 + i * 70;
      const card = this.add.rectangle(width / 2, y, 420, 55, ach.frame).setInteractive({ useHandCursor: true });
      this.add.text(width / 2, y, ach.name, {
        fontSize: '22px',
        color: '#3b2b20',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      card.on('pointerdown', () => {
        this.add.text(width / 2, y + 35, 'Unlocked!', { fontSize: '16px', color: '#FFD700' }).setOrigin(0.5);
        this.time.delayedCall(700, () => this.scene.start('WorldMapScene'));
      });
    });
  }
}