import Phaser from 'phaser';
import { S } from '../systems/state.js';
import { COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';

const memories = [
  { id: 'family', icon: '👨‍👩‍👦‍👦', title: 'The Family Team', color: 0xe76586 },
  { id: 'forest', icon: '👦🐶', title: 'Douglas Dash', color: 0x45a45b },
  { id: 'pirate', icon: '🏴‍☠️💰', title: 'Pirate Treasure', color: 0xd9862c },
  { id: 'dino', icon: '🦖🥚', title: 'Dino Rescue', color: 0x249989 },
  { id: 'space', icon: '🚀🌟', title: 'Space Mission', color: 0x4f5fb9 },
  { id: 'pumpkin', icon: '🎃🐱', title: 'Pumpkin Day', color: 0xe76527 },
  { id: 'babybell', icon: '🐱📦', title: 'Bell’s Hideout', color: 0x9b683d },
  { id: 'kingdom', icon: '🏰👑', title: 'Hudson Kingdom', color: 0xd99e19 },
  { id: 'town', icon: '🏘️🎖️', title: 'Hudson Town', color: 0x40a95b }
];

export default class FamilyPhotoWallScene extends Phaser.Scene {
  constructor() { super('FamilyPhotoWallScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x684322, 0x4a2e1a); topBar(this, 'FAMILY PHOTO WALL');
    this.add.text(W / 2, 125, `${S.photos.length} of ${memories.length} memories unlocked`, textStyle(18, '#fff1d1', { fontStyle: 'bold' })).setOrigin(0.5);
    memories.forEach((memory, i) => {
      const x = 120 + (i % 3) * 240; const y = 270 + Math.floor(i / 3) * 285; const open = S.photos.includes(memory.id); const title = S.customCaptions[memory.id] || memory.title;
      roundedPanel(this, x, y, 205, 235, open ? 0xffffff : 0x6e5b55, 1, open ? memory.color : 0x8b7d78);
      this.add.text(x, y - 35, open ? memory.icon : '🔒', textStyle(50)).setOrigin(0.5);
      this.add.text(x, y + 55, open ? title : 'Memory waiting', textStyle(15, open ? COLORS.ink : '#d1c8c5', { fontStyle: 'bold', align: 'center', wordWrap: { width: 180 } })).setOrigin(0.5);
      if (open) this.add.zone(x, y, 205, 235).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.show({ ...memory, title }));
    });
  }
  show(memory) {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(100);
    ov.add(this.add.rectangle(W / 2, H / 2, W, H, 0x160f2a, 0.86).setInteractive());
    ov.add(roundedPanel(this, W / 2, H / 2, 590, 650, 0xffffff, 1, memory.color).setDepth(101));
    ov.add(this.add.text(W / 2, H / 2 - 105, memory.icon, textStyle(125)).setOrigin(0.5).setDepth(102));
    ov.add(this.add.text(W / 2, H / 2 + 50, memory.title, textStyle(31, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(102));
    ov.add(this.add.text(W / 2, H / 2 + 105, 'A real Hudson’s World memory 💛', textStyle(18, '#655a72')).setOrigin(0.5).setDepth(102));
    ov.add(this.add.text(W / 2, H / 2 + 225, 'TAP ANYWHERE TO CLOSE', textStyle(16, '#655a72', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(102));
    ov.list[0].once('pointerdown', () => ov.destroy());
  }
}
