import Phaser from 'phaser';
import { S } from '../systems/state.js';
import { button, celebrateAt, COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';
import Narrator from '../systems/Narrator.js';

const memories = [
  { id: 'family', icon: '👨‍👩‍👦‍👦', title: 'The Family Team', color: 0xe76586, detail: 'Hudson, Douglas and the whole family started every adventure together, right from the very first day.' },
  { id: 'forest', icon: '👦🐶', title: 'Douglas Dash', color: 0x45a45b, detail: 'Hudson raced Douglas down the Temple Trail, dodging logs and gathering bones along the way.' },
  { id: 'pirate', icon: '🏴‍☠️💰', title: 'Pirate Treasure', color: 0xd9862c, detail: 'Captain Hudson dug up hidden chests all across Pirate Island with Douglas as first mate.' },
  { id: 'dino', icon: '🦖🥚', title: 'Dino Rescue', color: 0x249989, detail: 'Hudson gently guided every baby dino egg back to its own nest in Dino Valley.' },
  { id: 'space', icon: '🚀🌟', title: 'Space Mission', color: 0x4f5fb9, detail: 'Commander Hudson flew far into the stars to bring lost explorers safely home.' },
  { id: 'pumpkin', icon: '🎃🐱', title: 'Pumpkin Day', color: 0xe76527, detail: 'Hudson smashed a whole patch of pumpkins while keeping a watchful eye on Baby Bell.' },
  { id: 'babybell', icon: '🐱📦', title: 'Bell’s Hideout', color: 0x9b683d, detail: 'Baby Bell was found hiding in her favourite sparkly box, safe and sound as always.' },
  { id: 'kingdom', icon: '🏰👑', title: 'Hudson Kingdom', color: 0xd99e19, detail: 'Every adventure badge lit the path and the grand gates of Hudson Kingdom finally opened.' },
  { id: 'town', icon: '🏘️🎖️', title: 'Hudson Town', color: 0x40a95b, detail: 'Hudson built up the whole town, one brilliant place at a time, until he became Mayor.' }
];

export default class FamilyPhotoWallScene extends Phaser.Scene {
  constructor() { super('FamilyPhotoWallScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x684322, 0x4a2e1a); topBar(this, 'FAMILY PHOTO WALL'); Narrator.attach(this);
    this.add.text(W / 2, 125, `${S.photos.length} of ${memories.length} memories unlocked`, textStyle(18, '#fff1d1', { fontStyle: 'bold' })).setOrigin(0.5);
    memories.forEach((memory, i) => {
      const x = 120 + (i % 3) * 240; const y = 270 + Math.floor(i / 3) * 285; const open = S.photos.includes(memory.id); const title = S.customCaptions[memory.id] || memory.title;
      roundedPanel(this, x, y, 205, 235, open ? 0xffffff : 0x6e5b55, 1, open ? memory.color : 0x8b7d78);
      this.add.text(x, y - 35, open ? memory.icon : '🔒', textStyle(50)).setOrigin(0.5);
      this.add.text(x, y + 55, open ? title : 'Memory waiting', textStyle(15, open ? COLORS.ink : '#d1c8c5', { fontStyle: 'bold', align: 'center', wordWrap: { width: 180 } })).setOrigin(0.5);
      if (open) this.add.zone(x, y, 205, 235).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.show({ ...memory, title }));
    });
    button(this, W / 2, 1180, '✏️ EDIT CAPTIONS', () => this.scene.start('PhotoCaptionScene'), { width: 320, height: 56, color: 0x6c4ccf, fontSize: 16 });
  }
  show(memory) {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(150);
    const backdrop = this.add.rectangle(W / 2, H / 2, W, H, 0x160f2a, 0.86).setInteractive();
    backdrop.once('pointerdown', () => ov.destroy());
    ov.add(backdrop);
    ov.add(roundedPanel(this, W / 2, H / 2, 600, 660, 0xffffff, 1, memory.color).setDepth(151));
    celebrateAt(this, W / 2, H / 2 - 155, memory.color);
    ov.add(this.add.text(W / 2, H / 2 - 190, memory.icon, textStyle(110)).setOrigin(0.5).setDepth(152));
    ov.add(this.add.text(W / 2, H / 2 - 55, memory.title, textStyle(28, COLORS.ink, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5).setDepth(152));
    ov.add(this.add.text(W / 2, H / 2 + 30, memory.detail, textStyle(17, '#655a72', { align: 'center', wordWrap: { width: 500 }, lineSpacing: 6 })).setOrigin(0.5).setDepth(152));
    ov.add(button(this, W / 2, H / 2 + 175, '🔊 READ TO ME', () => Narrator.speak(`${memory.title}. ${memory.detail}`), { width: 280, height: 56, color: 0x47a8e8, fontSize: 18, depth: 153 }));
    ov.add(button(this, W / 2, H / 2 + 250, 'CLOSE', () => ov.destroy(), { width: 220, height: 54, color: memory.color, depth: 153 }));
  }
}
