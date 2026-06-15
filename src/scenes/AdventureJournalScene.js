import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, makeHUD, makeDock, sceneBg, addBackButton } from '../ui/kit.js';
import { S } from '../systems/state.js';
import { SFX } from '../systems/audio.js';
import { feel } from '../systems/feel.js';

export default class AdventureJournalScene extends Phaser.Scene {
  constructor() { super('AdventureJournalScene'); }

  create() {
    AudioManager.setScene(this);
    const { width:W, height:H } = this.scale;

    sceneBg(this, 'bg_journal', 0xFBEAD0, 0xE6CBA6);
    // Calm the busy painted background so entries read clearly (sits above bg, below content).
    this.add.rectangle(0, 0, W, H, 0xFBEAD0, 0.5).setOrigin(0).setDepth(-50);
    // Smaller title, dropped below the top HUD bar to avoid overlap.
    this.add.text(W/2, 88, '📖 The Adventures of Hudson', { fontFamily: FONT, fontSize: '22px', color: '#7a4a00', fontStyle: 'bold' }).setOrigin(0.5);

    const entries = S.journal.slice(0, 40);
    if (!entries.length) {
      this.add.text(W/2, H/2, 'Your storybook is empty.\nPlay an adventure to write your first page!', { fontFamily: FONT, fontSize: '18px', color: '#7a5a28', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
    }

    const view = this.add.container(0, 0);
    let y = 132;
    entries.forEach(e => {
      const card = this.add.container(W/2, y);
      const gold = /GOLDEN|Kingdom/i.test(e.title);
      const p = this.add.graphics();
      p.fillStyle(0xFFFDF6, 1); p.fillRoundedRect(-W*0.42, -2, W*0.84, 72, 12);
      p.fillStyle(gold ? 0xFFD23F : 0x9B6DD7, 1); p.fillRoundedRect(-W*0.42, -2, 8, 72, 4);
      card.add([p, this.add.text(-W*0.40+18, 8, e.ic + '  ' + e.title, { fontFamily: FONT, fontSize: '16px', color: '#3b2b20', fontStyle: 'bold', wordWrap:{width:W*0.74} }),
        this.add.text(-W*0.40+18, 34, e.text, { fontFamily: FONT, fontSize: '13px', color: '#5a4632', wordWrap:{width:W*0.76} })]);
      view.add(card);
      y += 84;
    });

    makeHUD(this); makeDock(this, 'AdventureJournalScene');
    addBackButton(this);
  }
}