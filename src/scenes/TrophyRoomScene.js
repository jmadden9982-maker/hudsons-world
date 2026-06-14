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

    // Golden Douglas Statue
    const found = localStorage.getItem('goldenDouglasFound') === 'true';

    const statueColor = found ? 0xFFD700 : 0x757575;
    const statue = this.add.rectangle(width / 2, 220, 130, 150, statueColor).setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 220, found ? '🐕✨' : '🔒', { fontSize: '52px' }).setOrigin(0.5);
    this.add.text(width / 2, 310, found ? 'Golden Douglas' : 'Golden Douglas (Locked)', {
      fontSize: '18px',
      color: found ? '#FFD700' : '#aaaaaa'
    }).setOrigin(0.5);

    statue.on('pointerdown', () => {
      if (found) {
        // Replay the moment
        if (window.startGoldenDouglasSequence) {
          window.startGoldenDouglasSequence(this);
        } else {
          this.scene.start('WorldMapScene');
        }
      } else {
        // First discovery!
        localStorage.setItem('goldenDouglasFound', 'true');

        if (window.startGoldenDouglasSequence) {
          window.startGoldenDouglasSequence(this);
        } else {
          this.add.text(width / 2, 380, 'You found Golden Douglas!', {
            fontSize: '22px',
            color: '#FFD700'
          }).setOrigin(0.5);
          this.time.delayedCall(1500, () => this.scene.start('WorldMapScene'));
        }
      }
    });

    // Other achievements
    const achievements = [
      { name: 'First Jump', color: 0xCD7F32 },
      { name: 'Score 100', color: 0xC0C0C0 },
      { name: 'Score 500', color: 0xFFD700 },
      { name: 'Baby Bell Finder', color: 0xCD7F32 }
    ];

    achievements.forEach((ach, i) => {
      const y = 420 + i * 65;
      this.add.rectangle(width / 2, y, 380, 50, ach.color);
      this.add.text(width / 2, y, ach.name, {
        fontSize: '20px',
        color: '#3b2b20',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    });

    this.add.text(width / 2, height - 50, found ? 'Tap Golden Douglas to replay!' : 'Find the secret...', {
      fontSize: '18px',
      color: '#FFD700'
    }).setOrigin(0.5);
  }
}