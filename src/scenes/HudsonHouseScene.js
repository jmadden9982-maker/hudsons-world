import Phaser from 'phaser';
import { S, addAchievement, addJournal, addPhoto, addSticker, persist } from '../systems/state.js';
import { button, celebrateAt, COLORS, hud, milestoneBurstAt, paintBackground, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';
import { createActor } from '../systems/CharacterActor.js';

const family = [
  { characterId: 'aimee', icon: '👩', name: 'Mum Aimee', line: '“You make every adventure brighter, Hudson.”', color: 0xe76586 },
  { characterId: 'james', icon: '👨', name: 'Dad James', line: '“Right, chief. What brilliant thing are we building?”', color: 0x4f77bb },
  { characterId: 'finley', icon: '👶', name: 'Finley', line: 'Finley claps, grabs a block and causes cheerful chaos.', color: 0x48a990 },
  { characterId: 'babybell', icon: '🐱', name: 'Baby Bell', line: 'Baby Bell has hidden again. Obviously.', color: 0x9b683d }
];

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() { super('HudsonHouseScene'); }
  create() {
    const { width: W, height: H } = this.scale; paintBackground(this, 0xf0bd87, 0x9d6a49); topBar(this, 'HUDSON HOUSE'); hud(this);
    this.add.rectangle(W / 2, 710, 660, 930, 0xf8e7cb, 0.82).setStrokeStyle(5, 0x9b683d);
    this.add.text(W / 2, 180, 'Home is the heart of every adventure', textStyle(20, COLORS.brown, { fontStyle: 'bold' })).setOrigin(0.5);
    this.familyActors = {};
    family.forEach((person, i) => {
      const x = 205 + (i % 2) * 310; const y = 330 + Math.floor(i / 2) * 230;
      roundedPanel(this, x, y, 265, 185, 0xffffff, 0.97, person.color);
      this.familyActors[person.name] = createActor(this, person.characterId, x, y - 45, { icon: person.icon, size: 54 });
      this.add.text(x, y + 10, person.name, textStyle(18, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
      this.add.text(x, y + 46, 'TAP TO CHAT', textStyle(13, '#766b87', { fontStyle: 'bold' })).setOrigin(0.5);
      this.add.zone(x, y, 265, 185).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        this.familyActors[person.name].playState('celebrate');
        celebrateAt(this, x, y - 45, person.color);
        if (person.name === 'Baby Bell') { this.findBell(); milestoneBurstAt(this, x, y - 45, S.babyBellCount, person.color); }
        else if (person.name === 'Finley') this.scene.start('FinleyChaosScene');
        else this.familyChat(person);
      });
    });
    this.add.text(W / 2, 675, 'FAMILY ROOMS', textStyle(17, COLORS.brown, { fontStyle: 'bold' })).setOrigin(0.5);
    button(this, 205, 755, '🐶 DOUGLAS DEN', () => this.scene.start('DouglasDenScene'), { width: 280, color: 0x9b683d, fontSize: 18 });
    button(this, 515, 755, '👕 WARDROBE', () => this.scene.start('WardrobeScene'), { width: 280, color: 0x8b63c7, fontSize: 18 });
    button(this, 205, 850, '📸 PHOTO WALL', () => this.scene.start('FamilyPhotoWallScene'), { width: 280, color: 0xf36f5f, fontSize: 18 });
    button(this, 515, 850, '🏆 TROPHIES', () => this.scene.start('TrophyRoomScene'), { width: 280, color: 0xd99e19, fontSize: 18 });
    button(this, 205, 945, '📖 JOURNAL', () => this.scene.start('AdventureJournalScene'), { width: 280, color: 0x6c4ccf, fontSize: 18 });
    button(this, 515, 945, '🏘️ HUDSON TOWN', () => this.scene.start('HudsonTownScene'), { width: 280, color: 0x40a95b, fontSize: 18 });
    this.add.text(W / 2, 1045, `Baby Bell discoveries: ${S.babyBellCount}   •   Tap Finley for chaos!`, textStyle(15, COLORS.brown, { fontStyle: 'bold' })).setOrigin(0.5);
  }
  familyChat(person) {
    if (person.name === 'Mum Aimee') addSticker('mum-heart');
    if (person.name === 'Dad James') addSticker('dad-tools');
    persist(); toast(this, person.line, person.color, 2300);
  }
  findBell() {
    S.babyBellCount += 1;
    if (S.babyBellCount === 1) { addPhoto('babybell'); addSticker('babybell-box'); addJournal('babybell', '🐱', 'Baby Bell’s Great Hiding Place', 'Hudson found Baby Bell tucked away in the house.'); }
    if (S.babyBellCount >= 5) addAchievement('bell-detective');
    persist(); toast(this, `🐱 Found her! Baby Bell discovery #${S.babyBellCount}`, 0x9b683d, 1800);
  }
}
