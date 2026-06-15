import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { addBackButton, sceneBg, makeDouglasSprite } from '../ui/kit.js';
import { onPetDouglas, onTreatDouglas } from '../systems/progression.js';

export default class DouglasDenScene extends Phaser.Scene {
  constructor() {
    super('DouglasDenScene');
  }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_playful');

    const { width, height } = this.scale;

    // Painted background if committed, else the original flat fallback colour.
    if (this.textures.exists('bg_den')) sceneBg(this, 'bg_den', 0xF5DEB3, 0xE8C99A);
    else this.add.rectangle(0, 0, width, height, 0xF5DEB3).setOrigin(0);

    // Only draw a scene title when there's no painted background (the art already names the den).
    if (!this.textures.exists('bg_den')) {
      this.add.text(width / 2, 55, 'Douglas Den', {
        fontSize: '36px',
        color: '#3b2b20',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    // Static props so the den feels lived-in (drawn behind Douglas).
    this.drawDenProps();

    // Real Douglas sprite if the sheet loaded, otherwise keep the brown rectangle.
    let douglas = makeDouglasSprite(this, width / 2, height / 2 - 60, 'douglas_idle');
    if (douglas) douglas.setScale(0.9);
    else douglas = this.add.rectangle(width / 2, height / 2 - 60, 150, 120, 0x8B4513);
    douglas.setInteractive({ useHandCursor: true });

    // Gentle idle bob (works for sprite or rectangle).
    this.tweens.add({ targets: douglas, y: douglas.y - 10, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Tapping Douglas himself pets him (the Back button is the way out).
    douglas.on('pointerdown', () => {
      AudioManager.playSfx('douglas_happy');
      this.flashMessage('Douglas is happy! 🐶');
      onPetDouglas(this);
    });

    const petBtn = this.add.rectangle(width / 2 - 160, height / 2 + 250, 160, 60, 0xFF69B4).setInteractive({ useHandCursor: true });
    this.add.text(width / 2 - 160, height / 2 + 250, 'Pet Douglas', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    petBtn.on('pointerdown', () => {
      AudioManager.playSfx('douglas_happy');
      this.flashMessage('Good boy! 🐶');
      onPetDouglas(this);
    });

    const treatBtn = this.add.rectangle(width / 2 + 160, height / 2 + 250, 160, 60, 0x32CD32).setInteractive({ useHandCursor: true });
    this.add.text(width / 2 + 160, height / 2 + 250, 'Give Treat', { fontSize: '20px', color: '#fff' }).setOrigin(0.5);

    treatBtn.on('pointerdown', () => {
      AudioManager.playSfx('douglas_bark');
      this.flashMessage('Yummy! 🦴');
      onTreatDouglas(this);
    });

    this.add.text(width / 2, height - 50, 'Douglas loves attention', {
      fontSize: '18px',
      color: '#3b2b20'
    }).setOrigin(0.5);

    addBackButton(this);
  }

  // Static decorative props (dog bed, bone, food bowl, ball, toy box) drawn behind Douglas.
  drawDenProps() {
    const { width, height } = this.scale;
    const g = this.add.graphics().setDepth(-10);
    // Dog bed cushion under Douglas.
    g.fillStyle(0x8B5A2B, 1); g.fillEllipse(width / 2, height / 2 + 100, 250, 74);
    g.fillStyle(0xC68A4E, 1); g.fillEllipse(width / 2, height / 2 + 96, 188, 48);
    // Floor props as emoji.
    const baseY = height / 2 + 124;
    const props = [
      { e: '🦴', x: width / 2 - 130, y: baseY },       // bone
      { e: '🥣', x: width / 2 - 50,  y: baseY + 8 },    // food bowl
      { e: '🎾', x: width / 2 + 50,  y: baseY + 4 },    // ball
      { e: '🧺', x: width / 2 + 132, y: baseY - 6 }     // toy box
    ];
    props.forEach(p => this.add.text(p.x, p.y, p.e, { fontSize: '40px' }).setOrigin(0.5).setDepth(-9));
  }

  // Brief, self-clearing feedback above the buttons (so repeat taps don't pile up).
  flashMessage(msg) {
    const { width, height } = this.scale;
    const t = this.add.text(width / 2, height / 2 + 120, msg, {
      fontSize: '20px', color: '#FFD23F', fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(60);
    this.tweens.add({ targets: t, alpha: 0, y: t.y - 24, delay: 600, duration: 400, onComplete: () => t.destroy() });
  }
}