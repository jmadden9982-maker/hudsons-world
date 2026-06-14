import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() {
    super('TrophyRoomScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x3E2723).setOrigin(0);

    this.add.text(width / 2, 50, 'Trophy Room', {
      fontSize: '36px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const found = SaveSystem.getGoldenDouglasFound();

    const statueColor = found ? 0xFFD700 : 0x757575;
    const statue = this.add.rectangle(width / 2, 200, 130, 150, statueColor).setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 200, found ? '🐕✨' : '🔒', { fontSize: '52px' }).setOrigin(0.5);
    this.add.text(width / 2, 290, found ? 'Golden Douglas' : 'Golden Douglas (Locked)', {
      fontSize: '18px',
      color: found ? '#FFD700' : '#aaaaaa'
    }).setOrigin(0.5);

    statue.on('pointerdown', () => {
      AudioManager.playSfx('button_confirm');
      if (found) {
        if (window.startGoldenDouglasSequence) window.startGoldenDouglasSequence(this);
      } else {
        SaveSystem.setGoldenDouglasFound();
        if (window.startGoldenDouglasSequence) window.startGoldenDouglasSequence(this);
      }
    });

    const achievements = [
      { id: 'first-jump', name: 'First Jump', color: 0xCD7F32 },
      { id: 'score-100', name: 'Score 100', color: 0xC0C0C0 },
      { id: 'score-500', name: 'Score 500', color: 0xFFD700 },
      { id: 'babybell', name: 'Baby Bell Finder', color: 0xCD7F32 },
      { id: 'golden-douglas', name: 'Golden Douglas Explorer', color: 0xFFD700 }
    ];

    achievements.forEach((ach, i) => {
      const y = 380 + i * 70;
      const card = this.add.rectangle(width / 2, y, 400, 55, ach.color).setInteractive({ useHandCursor: true });
      this.add.text(width / 2, y, ach.name, { fontSize: '20px', color: '#3b2b20', fontStyle: 'bold' }).setOrigin(0.5);

      card.on('pointerdown', () => {
        AudioManager.playSfx('button_confirm');
        this.unlockTrophy(card, ach);
      });
    });

    this.add.text(width / 2, height - 50, found ? 'Tap to replay Golden Douglas!' : 'Keep exploring...', {
      fontSize: '18px',
      color: '#FFD700'
    }).setOrigin(0.5);
  }

  unlockTrophy(card, ach) { /* existing unlock logic */ }
}