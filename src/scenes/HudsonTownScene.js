import Phaser from 'phaser';
import { BUILDINGS } from '../data/collections.js';
import { S, buildTownPlot, campaignBadges, townProgress } from '../systems/state.js';
import { button, celebrateAt, COLORS, paintBackground, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';
import { decorateLivingWorld, worldLabel } from '../systems/WorldSystem.js';

export default class HudsonTownScene extends Phaser.Scene {
  constructor() { super('HudsonTownScene'); }
  init(data) { this.celebrateMayor = !!data?.celebrateMayor; }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x76cdf0, 0x69b85e); decorateLivingWorld(this); topBar(this, S.town.mayor ? 'MAYOR HUDSON’S TOWN' : 'BUILD HUDSON TOWN');
    this.add.text(W / 2, 118, worldLabel(), textStyle(15, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 153, S.town.mayor ? '🎖️ A brilliant town built by Hudson' : `${townProgress()} / 6 town places built • Tap a plot`, textStyle(18, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    S.town.plots.forEach((buildingId, i) => {
      const x = 190 + (i % 2) * 340; const y = 290 + Math.floor(i / 2) * 250; const building = BUILDINGS.find((item) => item.id === buildingId);
      roundedPanel(this, x, y, 290, 205, building?.color || 0xf2ead8, 0.98, building?.color || 0x8b7d6a);
      this.add.text(x, y - 38, building?.icon || '➕', textStyle(64)).setOrigin(0.5);
      this.add.text(x, y + 33, building?.name || 'Empty Plot', textStyle(18, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
      this.add.text(x, y + 67, building ? 'TAP TO CHANGE' : 'BUILD SOMETHING', textStyle(12, '#6c4ccf', { fontStyle: 'bold' })).setOrigin(0.5);
      this.add.zone(x, y, 290, 205).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.openBuilder(i));
    });
    this.add.text(W / 2, 1060, S.town.mayor ? 'The town is complete, but Mayor Hudson can redesign it any time.' : 'New buildings open as adventure badges are earned.', textStyle(16, '#ffffff', { fontStyle: 'bold', align: 'center', wordWrap: { width: 620 } })).setOrigin(0.5);
    button(this, W / 2, 1145, '📚 COLLECTIONS', () => this.scene.start('CollectionsScene'), { width: 330, height: 62, color: 0x6c4ccf, fontSize: 18 });
    if (this.celebrateMayor) this.time.delayedCall(350, () => this.showMayor());
  }
  openBuilder(plot) {
    const { width: W, height: H } = this.scale; const badges = campaignBadges(); const overlay = this.add.container(0, 0).setDepth(150);
    overlay.add(this.add.rectangle(W / 2, H / 2, W, H, 0x171126, 0.86).setInteractive());
    overlay.add(roundedPanel(this, W / 2, H / 2, 650, 900, 0xfffbef, 1, 0x6c4ccf).setDepth(151));
    overlay.add(this.add.text(W / 2, 245, `CHOOSE FOR PLOT ${plot + 1}`, textStyle(27, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(152));
    BUILDINGS.forEach((building, i) => {
      const x = 190 + (i % 2) * 340; const y = 380 + Math.floor(i / 2) * 170; const locked = badges < building.needBadges; const used = S.town.plots.some((id, index) => id === building.id && index !== plot);
      roundedPanel(this, x, y, 285, 135, locked || used ? 0x80798b : 0xffffff, 1, locked || used ? 0xaaa1b3 : building.color).setDepth(152);
      overlay.add(this.add.text(x - 90, y, locked ? '🔒' : used ? '✅' : building.icon, textStyle(39)).setOrigin(0.5).setDepth(153));
      overlay.add(this.add.text(x + 25, y - 16, building.name, textStyle(15, locked || used ? '#eee8f2' : COLORS.ink, { fontStyle: 'bold', align: 'center', wordWrap: { width: 170 } })).setOrigin(0.5).setDepth(153));
      overlay.add(this.add.text(x + 25, y + 25, locked ? `Needs ${building.needBadges} badges` : used ? 'Already in town' : 'TAP TO BUILD', textStyle(11, locked || used ? '#eee8f2' : '#6c4ccf', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(153));
      const hit = this.add.zone(x, y, 285, 135).setInteractive({ useHandCursor: true }).setDepth(154); overlay.add(hit);
      hit.on('pointerdown', () => {
        if (locked) { toast(this, `Earn ${building.needBadges} badges to unlock ${building.name}.`, 0x6c4ccf); return; }
        if (used) { toast(this, `${building.name} already has a home.`, 0x6c4ccf); return; }
        const wasMayor = S.town.mayor; const built = buildTownPlot(plot, building.id); if (built) celebrateAt(this, x, y, building.color); this.scene.restart({ celebrateMayor: !wasMayor && S.town.mayor });
      });
    });
    overlay.add(button(this, W / 2, 1085, 'CLOSE', () => overlay.destroy(), { width: 240, height: 58, color: 0x6c4ccf, fontSize: 17, depth: 155 }));
  }
  showMayor() {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(200);
    ov.add(this.add.rectangle(W / 2, H / 2, W, H, 0x19122c, 0.86).setInteractive());
    celebrateAt(this, W / 2, H / 2, 0xd99e19);
    ov.add(roundedPanel(this, W / 2, H / 2, 620, 600, 0xfff7c8, 1, 0xd99e19).setDepth(201));
    ov.add(this.add.text(W / 2, H / 2 - 150, '🎖️👦🏘️', textStyle(82)).setOrigin(0.5).setDepth(202));
    ov.add(this.add.text(W / 2, H / 2 - 35, 'MAYOR HUDSON!', textStyle(39, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(202));
    ov.add(this.add.text(W / 2, H / 2 + 55, 'Six brilliant places. One brilliant mayor. Hudson Town is officially open!', textStyle(21, '#655a72', { align: 'center', wordWrap: { width: 500 }, lineSpacing: 7 })).setOrigin(0.5).setDepth(202));
    ov.add(button(this, W / 2, H / 2 + 205, 'CUT THE RIBBON!', () => ov.destroy(), { width: 360, color: 0xd99e19, depth: 203 }));
  }
}
