import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { sceneBg, FONT, toast } from '../ui/kit.js';
import { grantReward } from '../systems/progression.js';
import { track } from '../systems/family.js';
import SaveSystem from '../systems/SaveSystem.js';

// Themed locations baked into the illustrated world map (bg_worldmap_full, 864x1536).
// Positions are in 720x1280 canvas coords (the map shares the canvas 9:16 ratio, so it
// scales uniformly with no crop). Each routes to an existing scene; Dash worlds pass a
// { world } index so the runner starts at that theme. Locked zones have no content yet.
const LOCATIONS = [
  { name: 'Hudson Town',      x: 158, y: 300, scene: 'HudsonHouseScene' },
  { name: 'Douglas Forest',   x: 492, y: 355, scene: 'DouglasDenScene' },
  { name: 'Pirate Island',    x: 74,  y: 405, scene: 'DouglasDashScene', data: { world: 1 } },
  { name: 'Dino Valley',      x: 182, y: 478, scene: 'DouglasDashScene', data: { world: 2 } },
  { name: 'Space Station',    x: 518, y: 500, scene: 'DouglasDashScene', data: { world: 3 } },
  { name: 'Pumpkin Patch',    x: 96,  y: 665, scene: 'DouglasDashScene', data: { world: 4 } },
  { name: 'Winter Village',   x: 416, y: 685, locked: true },
  { name: 'Dragon Peaks',     x: 96,  y: 885, locked: true },
  { name: 'Adventure Kingdom', x: 320, y: 910, scene: 'DouglasDashScene', data: { world: 5 } }
];

// Feature screens that aren't themed locations live on a bottom toolbar.
const TOOLBAR = [
  { icon: '📖', label: 'Journal',  scene: 'AdventureJournalScene' },
  { icon: '📸', label: 'Photos',   scene: 'FamilyPhotoWallScene' },
  { icon: '🏆', label: 'Trophies', scene: 'TrophyRoomScene' },
  { icon: '👕', label: 'Wardrobe', scene: 'WardrobeScene' },
  { icon: '⭐', label: 'Quests',   scene: 'FamilyQuestScene' },
  { icon: '🎮', label: 'Games',    scene: 'GamesHubScene' }
];

export default class WorldMapScene extends Phaser.Scene {
  constructor() { super('WorldMapScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_calm');
    const { width: W, height: H } = this.scale;

    // Illustrated map background (falls back to the old flat map, then plain colour).
    if (this.textures.exists('bg_worldmap_full')) {
      sceneBg(this, 'bg_worldmap_full', 0x2C77B0, 0x2C77B0);
    } else if (this.textures.exists('bg_worldmap')) {
      sceneBg(this, 'bg_worldmap', 0x87CEEB, 0xBFE9FF);
    } else {
      this.add.rectangle(0, 0, W, H, 0x2C77B0).setOrigin(0);
    }

    // Title (the map's top band is sky, so this stays legible).
    this.add.text(W / 2, 46, 'Adventure Map', {
      fontFamily: FONT, fontSize: '34px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5).setShadow(0, 3, '#00000099', 6).setDepth(45);

    LOCATIONS.forEach(loc => this.buildLocation(loc));

    this.buildToolbar();
    this.applyDayNightWash();
    this.maybeSpawnBabybell();
  }

  buildLocation(loc) {
    // Soft pulsing ring as a tap affordance over the baked-in art.
    const ring = this.add.circle(loc.x, loc.y, 52)
      .setStrokeStyle(4, loc.locked ? 0xffffff : 0xFFD23F, loc.locked ? 0.25 : 0.6).setDepth(20);
    if (!loc.locked) {
      this.tweens.add({ targets: ring, scale: { from: 0.92, to: 1.08 }, alpha: { from: 0.45, to: 0.9 },
        duration: Phaser.Math.Between(900, 1300), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else {
      this.add.text(loc.x, loc.y, '🔒', { fontSize: '30px' }).setOrigin(0.5).setDepth(22);
    }

    const hit = this.add.circle(loc.x, loc.y, 58, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).setDepth(23);
    hit.on('pointerdown', () => {
      if (loc.locked) {
        AudioManager.playSfx('button_click');
        toast(this, '🔒 ' + loc.name + ' is coming soon!');
        return;
      }
      AudioManager.playSfx('button_confirm');
      this.tweens.add({ targets: ring, scale: 1.35, alpha: 0, duration: 220, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: hit, scale: 0.9, duration: 90, yoyo: true,
        onComplete: () => this.scene.start(loc.scene, loc.data || undefined) });
    });
  }

  buildToolbar() {
    const { width: W, height: H } = this.scale;
    const barY = H - 64, barH = 104, pad = 12;
    const barW = W - pad * 2;
    const g = this.add.graphics().setDepth(60);
    g.fillStyle(0x1b1430, 0.62); g.fillRoundedRect(pad, barY - barH / 2, barW, barH, 22);
    g.lineStyle(2, 0xffffff, 0.25); g.strokeRoundedRect(pad, barY - barH / 2, barW, barH, 22);

    const n = TOOLBAR.length;
    const slot = barW / n;
    TOOLBAR.forEach((b, i) => {
      const cx = pad + slot * (i + 0.5);
      this.add.text(cx, barY - 16, b.icon, { fontSize: '34px' }).setOrigin(0.5).setDepth(61);
      this.add.text(cx, barY + 26, b.label, { fontFamily: FONT, fontSize: '13px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(61);
      const hit = this.add.rectangle(cx, barY, slot - 4, barH - 8, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).setDepth(62);
      hit.on('pointerdown', () => {
        AudioManager.playSfx('button_confirm');
        this.tweens.add({ targets: hit, scaleX: 0.9, scaleY: 0.9, duration: 80, yoyo: true,
          onComplete: () => this.scene.start(b.scene) });
      });
    });
  }

  applyDayNightWash() {
    const { width: W, height: H } = this.scale;
    const hr = new Date().getHours();
    let color = 0x000000, alpha = 0;
    if (hr < 6) { color = 0x0A1A3A; alpha = 0.42; }
    else if (hr < 9) { color = 0xFFD9A0; alpha = 0.14; }
    else if (hr < 17) { alpha = 0; }
    else if (hr < 20) { color = 0xFF9A4D; alpha = 0.18; }
    else { color = 0x0A1A3A; alpha = 0.38; }
    // Above the map art but below toolbar/hotspots; non-interactive so taps pass through.
    if (alpha > 0) this.add.rectangle(0, 0, W, H, color, alpha).setOrigin(0).setDepth(50);
  }

  // Babybell occasionally hides on the map; finding her is a small, save-safe reward.
  maybeSpawnBabybell() {
    if (Math.random() > 0.5) return;
    const { width: W } = this.scale;
    const x = Phaser.Math.Between(80, W - 80);
    const y = Phaser.Math.Between(150, 240);
    const bell = this.add.text(x, y, '🐱', { fontSize: '40px' }).setOrigin(0.5).setAlpha(0).setDepth(70).setInteractive({ useHandCursor: true });
    this.time.delayedCall(Phaser.Math.Between(1200, 3000), () => {
      if (!bell.active) return;
      this.tweens.add({ targets: bell, alpha: 1, duration: 500 });
      this.tweens.add({ targets: bell, y: y - 8, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
    bell.on('pointerdown', () => {
      if (!bell.active) return;
      AudioManager.playSfx('golden_shimmer');
      try { SaveSystem.incrementBabyBellCount(); } catch (e) {}
      track('star', 1);
      grantReward(this, 20, 10, 'You found Babybell! 🐱');
      const burst = this.add.text(bell.x, bell.y, '✨', { fontSize: '44px' }).setOrigin(0.5).setDepth(71);
      this.tweens.add({ targets: burst, alpha: 0, scale: 1.8, duration: 600, onComplete: () => burst.destroy() });
      bell.destroy();
    });
  }
}
