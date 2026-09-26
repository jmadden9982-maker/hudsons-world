import Phaser from 'phaser';
import { S } from '../systems/state.js';
import { button, COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';
import Narrator from '../systems/Narrator.js';

const PAGE_SIZE = 8;

export default class AdventureJournalScene extends Phaser.Scene {
  constructor() { super('AdventureJournalScene'); }
  init(data) { this.page = data?.page || 0; }
  create() {
    const { width: W, height: H } = this.scale; paintBackground(this, 0xd2aa76, 0x8e633d); topBar(this, 'THE ADVENTURES OF HUDSON'); Narrator.attach(this);
    roundedPanel(this, W / 2, 680, 650, 1050, 0xfffae9, 0.99, 0x8d5e31);
    if (!S.journal.length) { this.add.text(W / 2, H / 2, 'Your first story page is waiting.\nPlay an adventure to write it!', textStyle(23, COLORS.brown, { align: 'center', fontStyle: 'bold' })).setOrigin(0.5); return; }
    const pages = Math.max(1, Math.ceil(S.journal.length / PAGE_SIZE)); this.page = Phaser.Math.Clamp(this.page, 0, pages - 1);
    let y = 180;
    S.journal.slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE).forEach((entry, i) => {
      const rowY = y;
      const paper = this.add.graphics(); paper.fillStyle(i % 2 ? 0xfff1cf : 0xffffff, 1); paper.fillRoundedRect(65, rowY - 8, 590, 98, 16);
      paper.lineStyle(3, i % 2 ? 0xe3bd72 : 0xd9cbdc, 1); paper.strokeRoundedRect(65, rowY - 8, 590, 98, 16);
      this.add.text(90, rowY + 15, entry.icon || entry.ic || '⭐', textStyle(36)).setOrigin(0, 0.5);
      this.add.text(145, rowY + 4, entry.title, textStyle(18, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
      this.add.text(145, rowY + 39, entry.text, textStyle(14, '#655a72', { wordWrap: { width: 460 } })).setOrigin(0, 0.5);
      this.add.zone(360, rowY + 40, 590, 98).setInteractive({ useHandCursor: true }).on('pointerdown', () => Narrator.speak(`${entry.title}. ${entry.text}`));
      y += 112;
    });
    this.add.text(W / 2, 1085, `PAGE ${this.page + 1} / ${pages}   •   TAP A MEMORY TO HEAR IT`, textStyle(14, COLORS.brown, { fontStyle: 'bold' })).setOrigin(0.5);
    if (pages > 1) {
      button(this, 185, 1150, '‹ PREVIOUS', () => this.scene.restart({ page: Math.max(0, this.page - 1) }), { width: 230, height: 56, color: this.page ? 0x8d5e31 : 0xb0a190, fontSize: 15 });
      button(this, 535, 1150, 'NEXT ›', () => this.scene.restart({ page: Math.min(pages - 1, this.page + 1) }), { width: 230, height: 56, color: this.page < pages - 1 ? 0x8d5e31 : 0xb0a190, fontSize: 15 });
    }
    this.add.text(W / 2, H - 35, `${S.journal.length} adventure ${S.journal.length === 1 ? 'memory' : 'memories'} saved`, textStyle(16, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
  }
}
