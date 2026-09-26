import Phaser from 'phaser';
import { S, totalZoneStars } from '../systems/state.js';
import { COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';

const trophies = [
  { id: 'all-zones', icon: '🏆', title: 'Five-Zone Hero', hint: 'Earn all five badges' },
  { id: 'perfect-adventurer', icon: '🌟', title: 'Perfect Adventurer', hint: 'Earn all 15 stars' },
  { id: 'best-friends', icon: '🐶', title: 'Douglas’ Best Friend', hint: 'Fill Douglas’ joy' },
  { id: 'bell-detective', icon: '🐱', title: 'Baby Bell Detective', hint: 'Find Baby Bell five times' },
  { id: 'legendary-friend', icon: '🦴', title: 'Legendary Friend', hint: 'Raise Douglas to level 5' },
  { id: 'chaos-controller', icon: '🌪️', title: 'Chaos Controller', hint: 'Help with Finley Chaos' },
  { id: 'winter-wonder', icon: '❄️', title: 'Winter Wonder', hint: 'Visit Winter Village' },
  { id: 'mayor-hudson', icon: '🎖️', title: 'Mayor Hudson', hint: 'Build six town places' },
  { id: 'golden-douglas', icon: '👑', title: 'Golden Douglas', hint: 'Finish the Kingdom finale' }
];

export default class TrophyRoomScene extends Phaser.Scene {
  constructor() { super('TrophyRoomScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x5e3b72, 0x38254c); topBar(this, 'TROPHY ROOM');
    this.add.text(W / 2, 125, `${S.achievements.length} trophies • ${totalZoneStars()} adventure stars`, textStyle(18, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    trophies.forEach((trophy, i) => {
      const x = 120 + (i % 3) * 240; const y = 285 + Math.floor(i / 3) * 290; const open = S.achievements.includes(trophy.id);
      roundedPanel(this, x, y, 210, 235, open ? 0xfff5bd : 0x71677a, 1, open ? 0xd99e19 : 0x938aa2);
      this.add.text(x, y - 50, open ? trophy.icon : '❔', textStyle(52)).setOrigin(0.5);
      this.add.text(x, y + 20, open ? trophy.title : 'Mystery Trophy', textStyle(15, open ? COLORS.ink : '#e5dfeb', { fontStyle: 'bold', align: 'center', wordWrap: { width: 180 } })).setOrigin(0.5);
      this.add.text(x, y + 72, open ? 'UNLOCKED!' : trophy.hint, textStyle(12, open ? '#8c6b13' : '#ded5e6', { align: 'center', wordWrap: { width: 180 } })).setOrigin(0.5);
    });
    this.add.text(W / 2, 1080, 'Trophies celebrate play. None can be lost.', textStyle(17, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
  }
}
