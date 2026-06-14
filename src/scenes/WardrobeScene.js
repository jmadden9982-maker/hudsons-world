import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';

export default class WardrobeScene extends Phaser.Scene {
  constructor() {
    super('WardrobeScene');
  }

  create() {
    AudioManager.setScene(this);

    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xEADFFB).setOrigin(0);

    this.add.text(width / 2, 50, 'Wardrobe', {
      fontSize: '36px',
      color: '#4A148C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.currentOutfit = SaveSystem.getCurrentOutfit();

    this.preview = this.add.rectangle(width / 2, 280, 140, 180, 0xFFCC80);
    this.hudsonEmoji = this.add.text(width / 2, 280, '👦', { fontSize: '80px' }).setOrigin(0.5);

    this.outfitLabel = this.add.text(width / 2, 400, this.getOutfitName(this.currentOutfit), {
      fontSize: '22px',
      color: '#4A148C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const outfits = [
      { id: 'everyday', name: 'Everyday', emoji: '👕', unlocked: true, color: 0x81D4FA, special: false },
      { id: 'super', name: 'Super Hudson', emoji: '🦸', unlocked: true, color: 0xFF5252, special: true },
      { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', unlocked: true, color: 0x5D4037, special: true },
      { id: 'dino', name: 'Dino Explorer', emoji: '🦖', unlocked: false, color: 0x4CAF50, special: true },
      { id: 'space', name: 'Space Hudson', emoji: '🚀', unlocked: false, color: 0x2196F3, special: true },
      { id: 'golden', name: 'Golden Explorer', emoji: '👑', unlocked: false, color: 0xFFD700, special: true, legendary: true }
    ];

    this.outfitCards = {};

    outfits.forEach((outfit, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 140 + col * 220;
      const y = 520 + row * 160;

      const bgColor = outfit.unlocked ? outfit.color : 0x757575;
      const card = this.add.rectangle(x, y, 180, 110, bgColor).setInteractive({ useHandCursor: true });
      this.outfitCards[outfit.id] = card;

      this.add.text(x, y - 20, outfit.emoji, { fontSize: '36px' }).setOrigin(0.5);
      this.add.text(x, y + 25, outfit.name, { fontSize: '16px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

      if (!outfit.unlocked) this.add.text(x, y + 50, '🔒', { fontSize: '20px' }).setOrigin(0.5);

      card.on('pointerdown', () => {
        if (outfit.unlocked) {
          AudioManager.playSfx('button_confirm');
          this.equipOutfit(outfit, card);
        } else {
          AudioManager.playSfx('button_click');
          this.tweens.add({ targets: card, x: card.x + 8, duration: 60, yoyo: true, repeat: 2 });
        }
      });
    });

    if (this.outfitCards[this.currentOutfit]) {
      this.outfitCards[this.currentOutfit].setStrokeStyle(4, 0xFFD700);
    }

    this.add.text(width / 2, height - 45, 'Tap an outfit to equip', {
      fontSize: '18px', color: '#4A148C' }).setOrigin(0.5);
  }

  getOutfitName(id) { /* ... */ }
  equipOutfit(outfit, card) { /* ... existing logic with AudioManager already called above ... */ }
}