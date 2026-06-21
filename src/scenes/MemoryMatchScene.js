import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, COL, sceneBg, addBackButton, gameButton, toast } from '../ui/kit.js';
import { grantReward, addJournal } from '../systems/progression.js';

const FACES = ['👦', '🐶', '👨', '👩', '🧒', '🐱']; // Hudson, Douglas, James, Aimee, Finley, Babybell

export default class MemoryMatchScene extends Phaser.Scene {
  constructor() { super('MemoryMatchScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_playful');
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_house')) {
      sceneBg(this, 'bg_house', 0xFFF1DA, 0xE7C9A0);
      this.add.rectangle(0, 0, W, H, 0xFFF1DA, 0.5).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0xFFF1DA).setOrigin(0);
    }

    this.add.text(W / 2, 60, '🃏 Memory Match', { fontFamily: FONT, fontSize: '28px', color: '#7a4a00', fontStyle: 'bold' }).setOrigin(0.5);
    this.movesText = this.add.text(W / 2, 100, 'Find all the pairs!', { fontFamily: FONT, fontSize: '16px', color: '#5a4632', fontStyle: 'bold' }).setOrigin(0.5);

    // Build a shuffled deck of 6 pairs (12 cards) in a 4x3 grid.
    let deck = Phaser.Utils.Array.Shuffle(FACES.concat(FACES));
    this.first = null; this.lock = false; this.matched = 0; this.moves = 0;
    this.cards = [];

    const cols = 4, rows = 3, cw = 140, chh = 152, gx = 18, gy = 20;
    const totalW = cols * cw + (cols - 1) * gx;
    const startX = (W - totalW) / 2 + cw / 2;
    const startY = 300;
    for (let i = 0; i < deck.length; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const x = startX + c * (cw + gx);
      const y = startY + r * (chh + gy);
      this.cards.push(this.makeCard(x, y, deck[i]));
    }

    addBackButton(this);
  }

  makeCard(x, y, value) {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 132, 148, COL.purp).setStrokeStyle(3, 0xffffff);
    const t = this.add.text(0, 0, '🐾', { fontSize: '54px' }).setOrigin(0.5);
    c.add([bg, t]);
    c.setSize(132, 148).setInteractive({ useHandCursor: true });
    const card = { c, bg, t, value, up: false, matched: false };
    c.on('pointerdown', () => this.flip(card));
    return card;
  }

  reveal(card, up) {
    card.up = up;
    card.t.setText(up ? card.value : '🐾');
    card.bg.setFillStyle(up ? 0xFFF6E0 : COL.purp);
  }

  flip(card) {
    if (this.lock || card.up || card.matched) return;
    AudioManager.playSfx('button_click');
    this.reveal(card, true);
    if (!this.first) { this.first = card; return; }

    this.moves++;
    this.lock = true;
    const a = this.first, b = card;
    this.first = null;

    if (a.value === b.value) {
      a.matched = b.matched = true;
      a.bg.setFillStyle(0xBfe6a0); b.bg.setFillStyle(0xBfe6a0);
      AudioManager.playSfx('reward_reveal');
      this.matched++;
      this.lock = false;
      if (this.matched === FACES.length) this.win();
    } else {
      this.time.delayedCall(720, () => { this.reveal(a, false); this.reveal(b, false); this.lock = false; });
    }
  }

  win() {
    AudioManager.playSfx('achievement');
    addJournal('memory_match_win', '🃏', 'Memory Master', 'Hudson matched the whole family in Memory Match!');
    grantReward(this, 20, 15, 'All pairs found!');
    this.movesText.setText('You did it in ' + this.moves + ' moves!');
    const { width: W, height: H } = this.scale;
    gameButton(this, W / 2 - 110, H - 200, 200, 60, '🔁 Play Again', COL.green, () => this.scene.restart()).setDepth(60);
    gameButton(this, W / 2 + 110, H - 200, 200, 60, '🎮 Games', COL.wood, () => this.scene.start('GamesHubScene')).setDepth(60);
  }
}
