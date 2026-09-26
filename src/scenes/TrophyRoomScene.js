import Phaser from 'phaser';
import { S, totalZoneStars } from '../systems/state.js';
import { button, celebrateAt, COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';
import Narrator from '../systems/Narrator.js';

const trophies = [
  { id: 'all-zones', icon: '🏆', title: 'Five-Zone Hero', hint: 'Earn all five badges', detail: 'Hudson earned a badge in every single adventure — Forest, Pirate, Dino, Space and Pumpkin!' },
  { id: 'perfect-adventurer', icon: '🌟', title: 'Perfect Adventurer', hint: 'Earn all 15 stars', detail: 'Hudson collected all fifteen adventure stars, the very best score in every world.' },
  { id: 'best-friends', icon: '🐶', title: 'Douglas’ Best Friend', hint: 'Fill Douglas’ joy', detail: 'Douglas’ joy reached 100 — Hudson is his very best friend in the whole world.' },
  { id: 'bell-detective', icon: '🐱', title: 'Baby Bell Detective', hint: 'Find Baby Bell five times', detail: 'Hudson found Baby Bell hiding five times. She can’t fool him anymore!' },
  { id: 'legendary-friend', icon: '🦴', title: 'Legendary Friend', hint: 'Raise Douglas to level 5', detail: 'Douglas reached friendship level 5, unlocking every look he owns.' },
  { id: 'chaos-controller', icon: '🌪️', title: 'Chaos Controller', hint: 'Help with Finley Chaos', detail: 'Hudson tamed the Finley Chaos Engine and tidied every flying toy.' },
  { id: 'winter-wonder', icon: '❄️', title: 'Winter Wonder', hint: 'Visit Winter Village', detail: 'Hudson guided the sleigh through a whole Winter Village adventure.' },
  { id: 'mayor-hudson', icon: '🎖️', title: 'Mayor Hudson', hint: 'Build six town places', detail: 'Hudson built six brilliant places and became Mayor of the whole town.' },
  { id: 'golden-douglas', icon: '👑', title: 'Golden Douglas', hint: 'Finish the Kingdom finale', detail: 'Hudson opened the royal door and found the rarest friend in the whole Kingdom.' }
];

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x5e3b72, 0x38254c); topBar(this, 'TROPHY ROOM'); Narrator.attach(this);
    this.add.text(W / 2, 125, `${S.achievements.length} trophies • ${totalZoneStars()} adventure stars`, textStyle(18, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    trophies.forEach((trophy, i) => {
      const x = 120 + (i % 3) * 240; const y = 285 + Math.floor(i / 3) * 290; const open = S.achievements.includes(trophy.id);
      roundedPanel(this, x, y, 210, 235, open ? 0xfff5bd : 0x71677a, 1, open ? 0xd99e19 : 0x938aa2);
      this.add.text(x, y - 50, open ? trophy.icon : '❔', textStyle(52)).setOrigin(0.5);
      this.add.text(x, y + 20, open ? trophy.title : 'Mystery Trophy', textStyle(15, open ? COLORS.ink : '#e5dfeb', { fontStyle: 'bold', align: 'center', wordWrap: { width: 180 } })).setOrigin(0.5);
      this.add.text(x, y + 72, open ? 'TAP TO CELEBRATE' : trophy.hint, textStyle(12, open ? '#8c6b13' : '#ded5e6', { align: 'center', wordWrap: { width: 180 } })).setOrigin(0.5);
      if (open) this.add.zone(x, y, 210, 235).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.showDetail(trophy));
    });
    this.add.text(W / 2, 1080, 'Trophies celebrate play. None can be lost.', textStyle(17, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
  }
  showDetail(trophy) {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(150);
    ov.add(this.add.rectangle(W / 2, H / 2, W, H, 0x160f2a, 0.86).setInteractive());
    ov.add(roundedPanel(this, W / 2, H / 2, 600, 620, 0xfffbef, 1, 0xd99e19).setDepth(151));
    celebrateAt(this, W / 2, H / 2 - 150, 0xd99e19);
    ov.add(this.add.text(W / 2, H / 2 - 190, trophy.icon, textStyle(90)).setOrigin(0.5).setDepth(152));
    ov.add(this.add.text(W / 2, H / 2 - 75, trophy.title, textStyle(28, COLORS.ink, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5).setDepth(152));
    ov.add(this.add.text(W / 2, H / 2 + 10, trophy.detail, textStyle(18, '#655a72', { align: 'center', wordWrap: { width: 500 }, lineSpacing: 6 })).setOrigin(0.5).setDepth(152));
    ov.add(button(this, W / 2, H / 2 + 160, '🔊 READ TO ME', () => Narrator.speak(`${trophy.title}. ${trophy.detail}`), { width: 280, height: 56, color: 0x47a8e8, fontSize: 18, depth: 153 }));
    ov.add(button(this, W / 2, H / 2 + 240, 'CLOSE', () => ov.destroy(), { width: 220, height: 54, color: 0xd99e19, depth: 153 }));
  }
}
