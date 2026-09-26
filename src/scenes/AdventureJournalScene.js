import Phaser from 'phaser';
import { S } from '../systems/state.js';
import { COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';

export default class AdventureJournalScene extends Phaser.Scene {
  constructor() { super('AdventureJournalScene'); }
  create() {
    const { width: W, height: H } = this.scale; paintBackground(this, 0xd2aa76, 0x8e633d); topBar(this, 'THE ADVENTURES OF HUDSON');
    roundedPanel(this, W / 2, 680, 650, 1050, 0xfffae9, 0.99, 0x8d5e31);
    if (!S.journal.length) this.add.text(W / 2, H / 2, 'Your first story page is waiting.\nPlay an adventure to write it!', textStyle(23, COLORS.brown, { align: 'center', fontStyle: 'bold' })).setOrigin(0.5);
    let y = 180;
    S.journal.slice(0, 9).forEach((entry, i) => {
      const paper = this.add.graphics(); paper.fillStyle(i % 2 ? 0xfff1cf : 0xffffff, 1); paper.fillRoundedRect(65, y - 8, 590, 98, 16);
      paper.lineStyle(3, i % 2 ? 0xe3bd72 : 0xd9cbdc, 1); paper.strokeRoundedRect(65, y - 8, 590, 98, 16);
      this.add.text(90, y + 15, entry.icon || entry.ic || '⭐', textStyle(36)).setOrigin(0, 0.5);
      this.add.text(145, y + 4, entry.title, textStyle(18, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
      this.add.text(145, y + 39, entry.text, textStyle(14, '#655a72', { wordWrap: { width: 480 } })).setOrigin(0, 0.5);
      y += 112;
    });
    this.add.text(W / 2, H - 55, `${S.journal.length} adventure ${S.journal.length === 1 ? 'memory' : 'memories'} saved`, textStyle(16, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
  }
}
