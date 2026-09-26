import Phaser from 'phaser';
import { S, persist } from '../systems/state.js';
import { COLORS, paintBackground, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';

const labels = {
  family: ['👨‍👩‍👦‍👦', 'The Family Team'], forest: ['👦🐶', 'Douglas Dash'], pirate: ['🏴‍☠️💰', 'Pirate Treasure'],
  dino: ['🦖🥚', 'Dino Rescue'], space: ['🚀🌟', 'Space Mission'], pumpkin: ['🎃🐱', 'Pumpkin Day'],
  babybell: ['🐱📦', 'Bell’s Hideout'], kingdom: ['🏰👑', 'Hudson Kingdom'], town: ['🏘️🎖️', 'Hudson Town']
};

export default class PhotoCaptionScene extends Phaser.Scene {
  constructor() { super('PhotoCaptionScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0xb79bd2, 0x705689); topBar(this, 'EDIT PHOTO CAPTIONS');
    this.add.text(W / 2, 120, 'Tap an unlocked memory to give it a family caption.', textStyle(16, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    S.photos.slice(0, 9).forEach((id, i) => {
      const [icon, fallback] = labels[id] || ['📸', id]; const x = 190 + (i % 2) * 340; const y = 245 + Math.floor(i / 2) * 185; const caption = S.customCaptions[id] || fallback;
      roundedPanel(this, x, y, 300, 150, 0xffffff, 0.98, 0x6c4ccf);
      this.add.text(x - 105, y, icon, textStyle(40)).setOrigin(0.5);
      this.add.text(x + 25, y - 12, caption, textStyle(15, COLORS.ink, { fontStyle: 'bold', align: 'center', wordWrap: { width: 190 } })).setOrigin(0.5);
      this.add.text(x + 25, y + 37, 'TAP TO EDIT', textStyle(11, '#6c4ccf', { fontStyle: 'bold' })).setOrigin(0.5);
      this.add.zone(x, y, 300, 150).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.edit(id, fallback));
    });
  }
  edit(id, fallback) {
    const current = S.customCaptions[id] || fallback;
    const value = window.prompt('Photo caption (kept only on this device):', current);
    if (value === null) return;
    const clean = value.trim().slice(0, 48);
    if (clean) S.customCaptions[id] = clean; else delete S.customCaptions[id];
    persist(); toast(this, 'Caption saved on this device.', 0x40a95b); this.time.delayedCall(450, () => this.scene.restart());
  }
}
