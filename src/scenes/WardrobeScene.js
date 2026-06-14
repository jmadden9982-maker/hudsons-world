import Phaser from 'phaser';
import SaveSystem from '../systems/SaveSystem.js';

export default class WardrobeScene extends Phaser.Scene {
  constructor() {
    super('WardrobeScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xEADFFB).setOrigin(0);

    this.add.text(width / 2, 50, 'Wardrobe', {
      fontSize: '36px',
      color: '#4A148C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.currentOutfit = SaveSystem.getCurrentOutfit();

    // === HUDSON PREVIEW ===
    this.preview = this.add.rectangle(width / 2, 280, 140, 180, 0xFFCC80);
    this.hudsonEmoji = this.add.text(width / 2, 280, '👦', { fontSize: '80px' }).setOrigin(0.5);

    this.outfitLabel = this.add.text(width / 2, 400, this.getOutfitName(this.currentOutfit), {
      fontSize: '22px',
      color: '#4A148C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // === OUTFIT CARDS ===
    this.outfitCards = {};

    const outfits = [
      { id: 'everyday', name: 'Everyday', emoji: '👕', unlocked: true, color: 0x81D4FA, special: false },
      { id: 'super', name: 'Super Hudson', emoji: '🦸', unlocked: true, color: 0xFF5252, special: true },
      { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', unlocked: true, color: 0x5D4037, special: true },
      { id: 'dino', name: 'Dino Explorer', emoji: '🦖', unlocked: false, color: 0x4CAF50, special: true },
      { id: 'space', name: 'Space Hudson', emoji: '🚀', unlocked: false, color: 0x2196F3, special: true },
      { id: 'golden', name: 'Golden Explorer', emoji: '👑', unlocked: false, color: 0xFFD700, special: true, legendary: true }
    ];

    outfits.forEach((outfit, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 140 + col * 220;
      const y = 520 + row * 160;

      const bgColor = outfit.unlocked ? outfit.color : 0x757575;
      const card = this.add.rectangle(x, y, 180, 110, bgColor).setInteractive({ useHandCursor: true });

      this.outfitCards[outfit.id] = card;

      this.add.text(x, y - 20, outfit.emoji, { fontSize: '36px' }).setOrigin(0.5);
      this.add.text(x, y + 25, outfit.name, {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      if (!outfit.unlocked) {
        this.add.text(x, y + 50, '🔒', { fontSize: '20px' }).setOrigin(0.5);
      }

      card.on('pointerdown', () => {
        if (outfit.unlocked) {
          this.equipOutfit(outfit, card);
        } else {
          // Locked feedback - gentle shake
          this.tweens.add({
            targets: card,
            x: card.x + 8,
            duration: 60,
            yoyo: true,
            repeat: 2
          });
        }
      });
    });

    // Highlight current outfit
    if (this.outfitCards[this.currentOutfit]) {
      const currentCard = this.outfitCards[this.currentOutfit];
      currentCard.setStrokeStyle(4, 0xFFD700);
    }

    this.add.text(width / 2, height - 45, 'Tap an outfit to equip', {
      fontSize: '18px',
      color: '#4A148C'
    }).setOrigin(0.5);
  }

  getOutfitName(id) {
    const map = {
      'everyday': 'Everyday Hudson',
      'super': 'Super Hudson',
      'pirate': 'Pirate Hudson',
      'dino': 'Dino Explorer',
      'space': 'Space Hudson',
      'golden': 'Golden Explorer'
    };
    return map[id] || 'Everyday Hudson';
  }

  equipOutfit(outfit, card) {
    // Deselect previous
    if (this.outfitCards[this.currentOutfit]) {
      this.outfitCards[this.currentOutfit].setStrokeStyle();
    }

    // Select new
    card.setStrokeStyle(4, 0xFFD700);

    // Preview animation
    this.tweens.add({
      targets: [this.preview, this.hudsonEmoji],
      scaleX: 1.12,
      scaleY: 1.12,
      duration: 120,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    // Sparkle around Hudson
    this.add.particles(this.preview.x, this.preview.y, 'particle_sparkle', {
      speed: { min: 40, max: 90 },
      scale: { start: 0.45, end: 0 },
      lifespan: 500
    }).explode(outfit.legendary ? 14 : 8);

    // Extra legendary effects
    if (outfit.legendary) {
      this.add.particles(this.preview.x, this.preview.y, 'particle_confetti', {
        speed: { min: 50, max: 110 },
        scale: { start: 0.5, end: 0 },
        lifespan: 650
      }).explode(8);
    }

    this.outfitLabel.setText(outfit.name);
    SaveSystem.setCurrentOutfit(outfit.id);
    this.currentOutfit = outfit.id;

    this.time.delayedCall(850, () => {
      this.scene.start('WorldMapScene');
    });
  }
}