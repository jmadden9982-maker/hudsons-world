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

    // Preview
    this.preview = this.add.rectangle(width / 2, 280, 140, 180, 0xFFCC80);
    this.add.text(width / 2, 280, '👦', { fontSize: '80px' }).setOrigin(0.5);

    this.outfitLabel = this.add.text(width / 2, 400, this.getOutfitName(this.currentOutfit), {
      fontSize: '22px',
      color: '#4A148C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const outfits = [
      { id: 'everyday', name: 'Everyday', emoji: '👕', unlocked: true, color: 0x81D4FA },
      { id: 'super', name: 'Super Hudson', emoji: '🦸', unlocked: true, color: 0xFF5252 },
      { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', unlocked: true, color: 0x5D4037 },
      { id: 'dino', name: 'Dino Explorer', emoji: '🦖', unlocked: false, color: 0x4CAF50 },
      { id: 'space', name: 'Space Hudson', emoji: '🚀', unlocked: false, color: 0x2196F3 },
      { id: 'golden', name: 'Golden Explorer', emoji: '👑', unlocked: false, color: 0xFFD700 }
    ];

    outfits.forEach((outfit, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 140 + col * 220;
      const y = 520 + row * 160;

      const bgColor = outfit.unlocked ? outfit.color : 0x757575;
      const card = this.add.rectangle(x, y, 180, 110, bgColor).setInteractive({ useHandCursor: true });

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
          this.add.text(x, y + 70, 'Locked!', { fontSize: '16px', color: '#FFD23F' }).setOrigin(0.5);
          this.time.delayedCall(600, () => this.scene.start('WorldMapScene'));
        }
      });
    });

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
    this.outfitLabel.setText(outfit.name);

    this.tweens.add({
      targets: card,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true
    });

    this.add.particles(card.x, card.y, 'particle_sparkle', {
      speed: { min: 40, max: 90 },
      scale: { start: 0.4, end: 0 },
      lifespan: 500
    }).explode(8);

    SaveSystem.setCurrentOutfit(outfit.id);

    this.time.delayedCall(800, () => {
      this.scene.start('WorldMapScene');
    });
  }
}