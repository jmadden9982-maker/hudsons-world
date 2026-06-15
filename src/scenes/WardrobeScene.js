import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';
import { addBackButton, sceneBg, makeVectorHudson } from '../ui/kit.js';
import { onOutfitEquip } from '../systems/progression.js';

const OUTFITS = [
  { id: 'everyday', name: 'Everyday',        emoji: '👕', unlocked: true,  color: 0x81D4FA },
  { id: 'super',    name: 'Super Hudson',    emoji: '🦸', unlocked: true,  color: 0xFF5252 },
  { id: 'pirate',   name: 'Pirate',          emoji: '🏴‍☠️', unlocked: true,  color: 0x5D4037 },
  { id: 'dino',     name: 'Dino Explorer',   emoji: '🦖', unlocked: false, color: 0x4CAF50 },
  { id: 'space',    name: 'Space Hudson',    emoji: '🚀', unlocked: false, color: 0x2196F3 },
  { id: 'golden',   name: 'Golden Explorer', emoji: '👑', unlocked: false, color: 0xFFD700, legendary: true }
];

export default class WardrobeScene extends Phaser.Scene {
  constructor() {
    super('WardrobeScene');
  }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_playful');

    const { width, height } = this.scale;

    if (this.textures.exists('bg_wardrobe')) {
      sceneBg(this, 'bg_wardrobe', 0xEADFFB, 0xD7C3F5);
      // Soft scrim so cards/text stay legible over the painted art.
      this.add.rectangle(0, 0, width, height, 0xEADFFB, 0.32).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, width, height, 0xEADFFB).setOrigin(0);
      // Only show a scene title in the fallback; the painted background already says "Wardrobe".
      this.add.text(width / 2, 50, 'Wardrobe', {
        fontSize: '36px', color: '#4A148C', fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    this.currentOutfit = SaveSystem.getCurrentOutfit();

    // Hudson preview: a clean code-drawn cartoon (no art asset needed); shirt recolours per outfit.
    this.hudson = makeVectorHudson(this, width / 2, 268, 1.05);

    // Outfit badge floating beside Hudson + the equipped-outfit name beneath him.
    this.outfitBadge = this.add.text(width / 2 + 92, 222, '', { fontSize: '40px' }).setOrigin(0.5);
    this.outfitLabel = this.add.text(width / 2, 400, '', {
      fontSize: '22px', color: '#4A148C', fontStyle: 'bold'
    }).setOrigin(0.5);

    // Outfit selection grid.
    this.outfitCards = {};
    OUTFITS.forEach((outfit, i) => {
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

    // Apply whatever outfit is currently saved (fall back to the first unlocked one).
    const current = OUTFITS.find(o => o.id === this.currentOutfit && o.unlocked) || OUTFITS[0];
    this.applyOutfitVisual(current);

    this.add.text(width / 2, height - 45, 'Tap an outfit to equip', {
      fontSize: '18px', color: '#4A148C'
    }).setOrigin(0.5);

    addBackButton(this);
  }

  getOutfitName(id) {
    const o = OUTFITS.find(x => x.id === id);
    return o ? o.name : 'Everyday';
  }

  // Update the preview (tint/colour, badge, name) and the selected-card highlight.
  applyOutfitVisual(outfit) {
    this.outfitLabel.setText(outfit.name);
    this.outfitBadge.setText(outfit.emoji);

    if (this.hudson && this.hudson.setOutfit) this.hudson.setOutfit(outfit.color);
    else if (this.preview) this.preview.setFillStyle(outfit.color);

    Object.values(this.outfitCards).forEach(c => c.setStrokeStyle());
    const sel = this.outfitCards[outfit.id];
    if (sel) sel.setStrokeStyle(4, 0xFFD700);
  }

  equipOutfit(outfit, card) {
    this.currentOutfit = outfit.id;
    SaveSystem.setCurrentOutfit(outfit.id);
    this.applyOutfitVisual(outfit);

    // Little pop so the change reads as an action.
    const target = this.hudson || this.preview;
    if (target) {
      this.tweens.add({ targets: target, scaleX: target.scaleX * 1.08, scaleY: target.scaleY * 1.08, duration: 110, yoyo: true });
    }

    // Progression: reward the first time each distinct outfit is tried.
    onOutfitEquip(this, outfit.id);
  }
}
