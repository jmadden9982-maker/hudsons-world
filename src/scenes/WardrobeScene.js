import Phaser from 'phaser';
import { S, persist } from '../systems/state.js';
import { COLORS, paintBackground, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';

const outfits = [
  { id: 'everyday', icon: '👕', name: 'Everyday Hudson', color: 0x47a8e8 },
  { id: 'ranger', icon: '🥾', name: 'Forest Ranger', color: 0x40a95b },
  { id: 'captain', icon: '🏴‍☠️', name: 'Pirate Captain', color: 0x9b683d },
  { id: 'dino', icon: '🦖', name: 'Dino Expert', color: 0x249989 },
  { id: 'astronaut', icon: '🚀', name: 'Space Commander', color: 0x4f5fb9 },
  { id: 'pumpkin', icon: '🎃', name: 'Pumpkin Champion', color: 0xe76527 },
  { id: 'royal', icon: '👑', name: 'Kingdom Hero', color: 0xd99e19 },
  { id: 'mayor', icon: '🎖️', name: 'Mayor Hudson', color: 0x3f9c62 }
];

export default class WardrobeScene extends Phaser.Scene {
  constructor() { super('WardrobeScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0xc4b0ef, 0x7f67b8); topBar(this, 'HUDSON’S WARDROBE');
    roundedPanel(this, W / 2, 260, 590, 220, 0xfffbef, 0.98, 0x6c4ccf);
    const current = outfits.find((o) => o.id === S.outfit) || outfits[0];
    this.add.text(W / 2 - 150, 250, '👦', textStyle(91)).setOrigin(0.5);
    this.add.text(W / 2 + 100, 225, current.icon, textStyle(56)).setOrigin(0.5);
    this.add.text(W / 2 + 100, 290, current.name, textStyle(21, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    outfits.forEach((outfit, i) => {
      const x = 180 + (i % 2) * 360; const y = 470 + Math.floor(i / 2) * 175; const open = S.outfits.includes(outfit.id);
      roundedPanel(this, x, y, 310, 140, open ? 0xffffff : 0x867d92, 1, open ? outfit.color : 0xaaa1b3);
      this.add.text(x - 95, y, open ? outfit.icon : '🔒', textStyle(44)).setOrigin(0.5);
      this.add.text(x + 25, y - 15, outfit.name, textStyle(16, open ? COLORS.ink : '#e5dfea', { fontStyle: 'bold', wordWrap: { width: 180 }, align: 'center' })).setOrigin(0.5);
      this.add.text(x + 25, y + 30, S.outfit === outfit.id ? 'WEARING' : open ? 'TAP TO WEAR' : 'Adventure reward', textStyle(12, open ? '#6c4ccf' : '#e5dfea', { fontStyle: 'bold' })).setOrigin(0.5);
      if (open) this.add.zone(x, y, 310, 140).setInteractive({ useHandCursor: true }).on('pointerdown', () => { S.outfit = outfit.id; persist(); toast(this, `${outfit.icon} ${outfit.name} equipped!`, outfit.color); this.time.delayedCall(500, () => this.scene.restart()); });
    });
  }
}
