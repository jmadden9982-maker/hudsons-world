import Phaser from 'phaser';
import { CRITTERS, STICKERS } from '../data/collections.js';
import { S } from '../systems/state.js';
import { button, COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';

export default class CollectionsScene extends Phaser.Scene {
  constructor() { super('CollectionsScene'); }
  init(data) { this.tab = data?.tab || this.tab || 'critters'; this.page = data?.page || 0; }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x8ed6ef, 0x6bbd70); topBar(this, 'HUDSON’S COLLECTIONS');
    button(this, 205, 130, `🐾 CRITTERS ${S.critters.length}/${CRITTERS.length}`, () => this.scene.restart({ tab: 'critters', page: 0 }), { width: 300, height: 62, color: this.tab === 'critters' ? 0x40a95b : 0x756a86, fontSize: 16 });
    button(this, 515, 130, `✨ STICKERS ${S.stickers.length}/${STICKERS.length}`, () => this.scene.restart({ tab: 'stickers', page: 0 }), { width: 300, height: 62, color: this.tab === 'stickers' ? 0xd99e19 : 0x756a86, fontSize: 16 });
    const source = this.tab === 'critters' ? CRITTERS : STICKERS; const unlocked = this.tab === 'critters' ? S.critters : S.stickers; const pageSize = 8; const pages = Math.ceil(source.length / pageSize); this.page = Phaser.Math.Clamp(this.page, 0, pages - 1);
    source.slice(this.page * pageSize, this.page * pageSize + pageSize).forEach((item, i) => {
      const x = 190 + (i % 2) * 340; const y = 290 + Math.floor(i / 2) * 205; const open = unlocked.includes(item.id);
      roundedPanel(this, x, y, 295, 165, open ? 0xffffff : 0x777181, 0.98, open ? (this.tab === 'critters' ? 0x40a95b : 0xd99e19) : 0xa39ba7);
      this.add.text(x, y - 28, open ? item.icon : '❔', textStyle(51)).setOrigin(0.5);
      this.add.text(x, y + 28, open ? item.name : 'Mystery', textStyle(17, open ? COLORS.ink : '#eee8f2', { fontStyle: 'bold' })).setOrigin(0.5);
      if (open && item.home) this.add.text(x, y + 57, item.home, textStyle(12, '#6f6385')).setOrigin(0.5);
    });
    this.add.text(W / 2, 1115, `PAGE ${this.page + 1} / ${pages}`, textStyle(16, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    button(this, 190, 1180, '‹ PREVIOUS', () => this.scene.restart({ tab: this.tab, page: Math.max(0, this.page - 1) }), { width: 250, height: 58, color: this.page ? 0x6c4ccf : 0x777181, fontSize: 17 });
    button(this, 530, 1180, 'NEXT ›', () => this.scene.restart({ tab: this.tab, page: Math.min(pages - 1, this.page + 1) }), { width: 250, height: 58, color: this.page < pages - 1 ? 0x6c4ccf : 0x777181, fontSize: 17 });
  }
}
