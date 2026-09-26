import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { S, addAchievement, addCritter, addJournal, addSticker, addXp, persist } from '../systems/state.js';
import { COLORS, premiumBackdrop, queuePremiumBackdrop, roundedPanel, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { nearestDestination } from '../systems/gameplay.js';

const items = [
  { icon: '⚽', name: 'Ball', home: 'basket' }, { icon: '🧱', name: 'Block', home: 'box' },
  { icon: '🧦', name: 'Sock', home: 'basket' }, { icon: '🧸', name: 'Teddy', home: 'bed' },
  { icon: '📘', name: 'Book', home: 'shelf' }, { icon: '🚗', name: 'Car', home: 'box' },
  { icon: '🛏️', name: 'Pillow', home: 'bed' }, { icon: '📗', name: 'Storybook', home: 'shelf' },
  { icon: '🏀', name: 'Basketball', home: 'basket' }, { icon: '🧩', name: 'Puzzle', home: 'box' }
];

const homes = [
  { id: 'box', icon: '📦', label: 'TOY BOX', x: 150, y: 735, color: 0x47a8e8 },
  { id: 'shelf', icon: '📚', label: 'BOOKSHELF', x: 570, y: 735, color: 0x6c4ccf },
  { id: 'basket', icon: '🧺', label: 'BASKET', x: 135, y: 1010, color: 0xd48b3f },
  { id: 'bed', icon: '🛏️', label: 'COSY BED', x: 575, y: 1010, color: 0xf36f5f }
];

export default class FinleyChaosScene extends AdventureBase {
  constructor() { super('FinleyChaosScene'); }

  preload() { queuePremiumBackdrop(this, 'premium-finley', 'assets/premium/finley-playroom.png'); }

  create() {
    this.round = 0; this.tidied = 0; this.mistakes = 0; this.usedItems = [];
    premiumBackdrop(this, 'premium-finley', { shade: 0.1, drift: false, transient: true });
    this.add.text(360, 148, '👶  FINLEY CHAOS ENGINE  🌪️', textStyle(24, '#ffffff', { fontStyle: 'bold', stroke: '#56381f', strokeThickness: 7 })).setOrigin(0.5);
    roundedPanel(this, 360, 385, 440, 300, 0xfffbef, 0.9, 0xffd447);
    this.prompt = this.add.text(360, 292, '', textStyle(20, COLORS.ink, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5);
    this.status = this.add.text(360, 560, 'ROOM 1/8   ✅ 0', textStyle(19, '#ffffff', { fontStyle: 'bold', backgroundColor: '#40365f', padding: { x: 16, y: 8 } })).setOrigin(0.5).setDepth(40);
    this.homeZones = homes.map((home) => {
      const glow = this.add.circle(home.x, home.y, 88, home.color, 0.18).setStrokeStyle(4, 0xffffff, 0.8).setDepth(12);
      this.add.text(home.x, home.y - 8, home.icon, textStyle(52)).setOrigin(0.5).setDepth(13);
      this.add.text(home.x, home.y + 62, home.label, textStyle(13, '#ffffff', { fontStyle: 'bold', stroke: '#33223f', strokeThickness: 5 })).setOrigin(0.5).setDepth(13);
      return { ...home, glow };
    });
    this.add.text(360, 1170, 'Drag each toy to its home • Wobbly guesses can try again!', textStyle(15, '#ffffff', { fontStyle: 'bold', stroke: '#56381f', strokeThickness: 5 })).setOrigin(0.5).setDepth(20);
    this.begin('FINLEY CHAOS!', 'Finley has launched every toy across the playroom. Drag each object into the right home: basket, toy box, cosy bed or bookshelf. Wrong drops bounce back so you can try again!', '👶🌪️');
  }

  onAdventureStart() { this.nextItem(); }

  nextItem() {
    if (this.round >= 8) { this.finish(); return; }
    const choices = items.filter((item) => !this.usedItems.includes(item.name));
    this.target = Phaser.Utils.Array.GetRandom(choices.length ? choices : items); this.usedItems.push(this.target.name);
    this.prompt.setText(`Where does the ${this.target.name.toLowerCase()} belong?`);
    this.status.setText(`ROOM ${this.round + 1}/8   ✅ ${this.tidied}   ↩ ${this.mistakes}`);
    const item = this.add.text(360, 410, this.target.icon, textStyle(104, '#ffffff', { stroke: '#ffffff', strokeThickness: 2 })).setOrigin(0.5).setDepth(30).setInteractive({ useHandCursor: true });
    item.setData('home', this.target.home); item.setData('startX', 360); item.setData('startY', 410); this.currentItem = item;
    this.input.setDraggable(item);
    this.tweens.add({ targets: item, scale: { from: 0.35, to: 1 }, angle: { from: -12, to: 0 }, duration: 350, ease: 'Back.easeOut' });
    item.on('dragstart', () => { if (this.started) this.tweens.add({ targets: item, scale: 1.18, duration: 100 }); });
    item.on('drag', (pointer, dragX, dragY) => {
      if (!this.started || this.finished) return;
      item.setPosition(Phaser.Math.Clamp(dragX, 55, 665), Phaser.Math.Clamp(dragY, 260, 1090));
      this.homeZones.forEach((home) => home.glow.setAlpha(Phaser.Math.Distance.Between(item.x, item.y, home.x, home.y) < 125 ? 1 : 0.55));
    });
    item.on('dragend', () => this.dropItem(item));
  }

  dropItem(item) {
    if (!this.started || this.finished || !item.active) return;
    this.homeZones.forEach((home) => home.glow.setAlpha(1));
    const closest = nearestDestination(item.x, item.y, this.homeZones);
    if (closest.distance < 120 && closest.destination.id === item.getData('home')) {
      const home = closest.destination;
      item.disableInteractive(); this.tidied += 1; this.round += 1; AudioManager.playSfx('success');
      this.floatingText(home.x, home.y - 80, 'PERFECT TIDY!', '#ffd447'); this.celebrate(home.x, home.y, home.color);
      this.tweens.add({ targets: item, x: home.x, y: home.y, scale: 0.25, angle: 360, alpha: 0.3, duration: 420, ease: 'Back.easeIn', onComplete: () => { item.destroy(); this.time.delayedCall(220, () => this.nextItem()); } });
    } else {
      this.mistakes += 1; AudioManager.playSfx('button_click'); this.floatingText(item.x, item.y, 'WOBBLY DROP — TRY AGAIN!', '#ffffff');
      this.tweens.add({ targets: item, x: item.getData('startX'), y: item.getData('startY'), scale: 1, angle: 0, duration: 420, ease: 'Back.easeOut' });
      this.status.setText(`ROOM ${this.round + 1}/8   ✅ ${this.tidied}   ↩ ${this.mistakes}`);
    }
  }

  finish() {
    if (this.finished) return; this.finished = true;
    const stars = this.mistakes <= 2 ? 3 : this.mistakes <= 5 ? 2 : 1; const score = Math.max(300, this.tidied * 160 - this.mistakes * 25);
    S.finleyChaosWins += 1; S.stars += stars; addXp(25); addSticker('finley-whirl'); addCritter('chaos-panda'); addAchievement('chaos-controller');
    addJournal('finley-chaos', '👶', 'The Finley Chaos Engine', `Hudson dragged ${this.tidied} flying things back into their homes after Finley’s magnificent eruption.`); persist();
    showAdventureResult(this, { title: 'CHAOS CONTROLLED!', message: `Every toy is home after ${this.mistakes} wobbly ${this.mistakes === 1 ? 'drop' : 'drops'}. Finley is already eyeing the toy box again.`, stars, score, scoreLabel: 'Tidy score', rewardText: 'Finley Whirl sticker + Chaos Panda critter!', onReplay: () => this.scene.restart() });
  }
}
