// Shared UI kit for Hudson's World — one consistent game-style system for every scene.
import Phaser from 'phaser';
import { S, xpNeed } from '../systems/state.js';
import { SFX } from '../systems/audio.js';

export const FONT = '"Baloo 2","Trebuchet MS",sans-serif';
export const COL = {
  gold: 0xFFD23F, green: 0x5BA838, blue: 0x3FA7D6, purp: 0x9B6DD7, purple: 0x9B6DD7,
  berry: 0xE5455E, wood: 0x6E4422, cream: 0xFFF6E0, ink: 0x3b2b20, white: 0xffffff
};

function _shade(hex, f) {
  const r = (hex >> 16) & 255, g = (hex >> 8) & 255, b = hex & 255;
  const c = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return (c(r * f) << 16) | (c(g * f) << 8) | c(b * f);
}

export function bg(scene, top = 0x7EC8F2, bot = 0xFFF1DA) {
  const { width: W, height: H } = scene.scale;
  const g = scene.add.graphics();
  if (g.fillGradientStyle) g.fillGradientStyle(top, top, bot, bot, 1); else g.fillStyle(top, 1);
  g.fillRect(0, 0, W, H);
  return g.setDepth(-100);
}

// Painted-background slot: draws the texture cover-style if it was loaded, else a themed gradient.
export function sceneBg(scene, key, top = 0x7EC8F2, bot = 0xFFF1DA) {
  const { width: W, height: H } = scene.scale;
  if (key && scene.textures.exists(key)) {
    const img = scene.add.image(W / 2, H / 2, key);
    const sc = Math.max(W / img.width, H / img.height);
    return img.setScale(sc).setDepth(-100);
  }
  return bg(scene, top, bot);
}

export function header(scene, title) {
  const { width: W } = scene.scale;
  return scene.add.text(W / 2, 40, title, { fontFamily: FONT, fontSize: '34px', color: '#7a4a00', fontStyle: 'bold' })
    .setOrigin(0.5).setDepth(30).setShadow(0, 2, '#ffffff88', 2);
}

export function panel(scene, x, y, w, h, color = 0xFFF6E0) {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.20); g.fillRoundedRect(x - w / 2, y - h / 2 + 8, w, h, 24);
  g.fillStyle(color, 1);       g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 24);
  g.lineStyle(4, 0xffffff, 0.85); g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 24);
  return g;
}

export function toast(scene, msg) {
  const { width: W, height: H } = scene.scale;
  const t = scene.add.text(W / 2, H - 150, msg, {
    fontFamily: FONT, fontSize: '20px', color: '#fff', fontStyle: 'bold',
    backgroundColor: '#3b2b20ee', padding: { x: 18, y: 10 }, align: 'center', wordWrap: { width: W * 0.82 }
  }).setOrigin(0.5).setDepth(200);
  scene.tweens?.add({ targets: t, alpha: 0, delay: 2000, duration: 500, onComplete: () => t.destroy() });
  return t;
}

export function gameButton(scene, x, y, w, h, label, color = COL.green, onTap = () => {}) {
  const c = scene.add.container(x, y).setDepth(20);
  const g = scene.add.graphics();
  const r = Math.min(22, h / 2);
  const dark = _shade(color, 0.62), gloss = _shade(color, 1.35);
  g.fillStyle(0x000000, 0.28); g.fillRoundedRect(-w / 2, -h / 2 + 8, w, h, r);
  g.fillStyle(dark, 1);        g.fillRoundedRect(-w / 2, -h / 2 + 5, w, h, r);
  g.fillStyle(color, 1);       g.fillRoundedRect(-w / 2, -h / 2, w, h - 5, r);
  g.fillStyle(gloss, 0.5);     g.fillRoundedRect(-w / 2 + 5, -h / 2 + 5, w - 10, (h - 5) * 0.42, r - 5);
  g.lineStyle(3, 0xffffff, 0.85); g.strokeRoundedRect(-w / 2, -h / 2, w, h - 5, r);
  const t = scene.add.text(0, -3, label, { fontFamily: FONT, fontSize: h > 70 ? '28px' : '22px', color: '#fff', fontStyle: 'bold', align: 'center' })
    .setOrigin(0.5).setShadow(0, 2, '#00000066', 3);
  c.add([g, t]);
  c.setSize(Math.max(w, 96), Math.max(h, 56)).setInteractive({ useHandCursor: true });
  c.on('pointerdown', () => { SFX.tap(); scene.tweens?.add({ targets: c, y: y + 4, duration: 70, yoyo: true, onComplete: onTap }); if (!scene.tweens) onTap(); });
  return c;
}

// Top HUD: coin/star pills + level shield with XP bar.
export function makeHUD(scene) {
  const { width: W } = scene.scale;
  const d = scene.add.container(0, 0).setDepth(80);
  const g = scene.add.graphics();
  g.fillStyle(0x2a1a0e, 0.82); g.fillRoundedRect(8, 8, W - 16, 52, 18);
  g.lineStyle(2, 0xB07B4F, 0.9); g.strokeRoundedRect(8, 8, W - 16, 52, 18);
  d.add(g);
  const pill = (x, icon, val) => {
    const pg = scene.add.graphics();
    pg.fillStyle(0x000000, 0.30); pg.fillRoundedRect(x, 18, 120, 32, 16);
    d.add(pg);
    d.add(scene.add.text(x + 18, 34, icon, { fontSize: '20px' }).setOrigin(0.5));
    d.add(scene.add.text(x + 36, 34, '' + val, { fontFamily: FONT, fontSize: '19px', color: '#fff', fontStyle: 'bold' }).setOrigin(0, 0.5));
  };
  pill(18, '🪙', S.coins ?? 0);
  pill(150, '⭐', S.stars ?? 0);
  const sx = W - 150, xpw = 96, need = xpNeed(S.level), frac = Math.max(0, Math.min(1, (S.xp ?? 0) / need));
  const track = scene.add.graphics(); track.fillStyle(0x000000, 0.35); track.fillRoundedRect(sx + 18, 28, xpw, 14, 7); d.add(track);
  d.add(scene.add.rectangle(sx + 20, 35, Math.max(1, (xpw - 4) * frac), 12, 0x6FD66F).setOrigin(0, 0.5));
  d.add(scene.add.text(sx, 35, '🛡️', { fontSize: '26px' }).setOrigin(0.5));
  d.add(scene.add.text(sx, 34, '' + (S.level ?? 1), { fontFamily: FONT, fontSize: '13px', color: '#3b2b20', fontStyle: 'bold' }).setOrigin(0.5));
  return d;
}

// Bottom navigation dock — all targets are registered scenes.
const DOCK = [
  { k: 'WorldMapScene', e: '🗺️', l: 'Map' },
  { k: 'HudsonHouseScene', e: '🏡', l: 'House' },
  { k: 'DouglasDenScene', e: '🐶', l: 'Douglas' },
  { k: 'AdventureJournalScene', e: '📖', l: 'Journal' },
  { k: 'FamilyPhotoWallScene', e: '📸', l: 'Photos' },
  { k: 'WardrobeScene', e: '👕', l: 'Dress' }
];
export function makeDock(scene, activeKey) {
  const { width: W, height: H } = scene.scale;
  const d = scene.add.container(0, H - 64).setDepth(90);
  d.add(scene.add.rectangle(0, 0, W, 64, COL.wood, 1).setOrigin(0, 0));
  d.add(scene.add.rectangle(0, 0, W, 4, 0xB07B4F, 1).setOrigin(0, 0));
  const step = W / DOCK.length;
  DOCK.forEach((item, i) => {
    const x = step * i + step / 2;
    const c = scene.add.container(x, 32);
    const badge = scene.add.circle(0, -8, 19, item.k === activeKey ? COL.gold : 0xE0A86B).setStrokeStyle(2, 0xFFE9C9);
    const e = scene.add.text(0, -8, item.e, { fontSize: '20px' }).setOrigin(0.5);
    const l = scene.add.text(0, 18, item.l, { fontFamily: FONT, fontSize: '11px', color: '#FFE9C9', fontStyle: 'bold' }).setOrigin(0.5);
    c.add([badge, e, l]);
    c.setSize(step, 64).setInteractive({ useHandCursor: true });
    c.on('pointerdown', () => { if (item.k !== activeKey) { SFX.tap(); scene.scene.start(item.k); } });
    d.add(c);
  });
  return d;
}

export function backButton(scene, onTap) {
  const { height: H } = scene.scale;
  return gameButton(scene, 100, H - 110, 160, 60, '⬅ Back', COL.wood, onTap || (() => scene.scene.start('WorldMapScene'))).setDepth(120);
}

// Compatibility aliases used by some scenes — real implementations, not stubs.
export function addBackButton(scene, targetScene = 'WorldMapScene') {
  return backButton(scene, () => scene.scene.start(targetScene));
}
export function addBottomDock(scene, activeKey = '') { return makeDock(scene, activeKey); }
export function addPremiumHud(scene) { return makeHUD(scene); }
