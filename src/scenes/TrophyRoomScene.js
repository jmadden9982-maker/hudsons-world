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
        AudioManager.playSfx('trophy_unlock');
        this.unlockTrophy(card, ach);
      });
    });

    this.add.text(width / 2, height - 50, found ? 'Tap to replay Golden Douglas!' : 'Keep exploring...', {
      fontSize: '18px',
      color: '#FFD700'
    }).setOrigin(0.5);
  }

  unlockTrophy(card, ach) {
    this.time.delayedCall(180, () => {
      this.tweens.add({
        targets: card,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 180,
        yoyo: true,
        ease: 'Back.easeOut'
      });

      const glow = this.add.circle(card.x, card.y, 60, 0xFFD700, 0.4);
      this.tweens.add({
        targets: glow,
        scale: 2.2,
        alpha: 0,
        duration: 600,
        onComplete: () => glow.destroy()
      });

      AudioManager.playSfx('sparkle');
      this.add.particles(card.x, card.y, 'particle_sparkle', {
        speed: { min: 50, max: 130 },
        scale: { start: 0.5, end: 0 },
        lifespan: 650
      }).explode(ach.special ? 18 : 12);

      if (ach.special) {
        AudioManager.playSfx('celebration');
        this.add.particles(card.x, card.y, 'particle_confetti', {
          speed: { min: 60, max: 150 },
          scale: { start: 0.6, end: 0 },
          lifespan: 800
        }).explode(10);
      }

      AudioManager.playSfx('achievement');
      const popup = this.add.text(card.x, card.y - 70, '🏆 ' + ach.name + ' Unlocked!', {
        fontSize: ach.special ? '24px' : '20px',
        color: '#FFD700',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      this.tweens.add({
        targets: popup,
        y: card.y - 110,
        alpha: 0,
        duration: 900,
        onComplete: () => popup.destroy()
      });

      SaveSystem.addStars(ach.special ? 100 : 25);
    });
  }
}