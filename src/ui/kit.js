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

// --- Safe scene navigation + lifecycle (stability) -------------------------
// Re-entrancy guard: rapid/repeated taps must not fire overlapping scene.start()
// calls (the #94 unresponsiveness). Disables input + fades, then starts once.
export function gotoScene(scene, key, data) {
  if (scene._navigating) return;       // ignore overlapping/rapid taps
  scene._navigating = true;
  try { scene.input.enabled = false; } catch (e) {}
  console.log('[nav] ->', key);
  scene.scene.start(key, data);        // no camera fade: avoids black-screen on reused-instance re-entry
}

// Call once in a scene's create(): logs start/shutdown, resets the nav guard for
// the reused scene instance, and defensively frees tweens/timers/input on shutdown.
export function installSceneLifecycle(scene, name) {
  scene._navigating = false;
  try { scene.input.enabled = true; } catch (e) {}
  // Belt-and-suspenders: clear any leftover camera FX on (re)entry of a reused instance.
  try { const cam = scene.cameras && scene.cameras.main; if (cam) cam.resetFX(); } catch (e) {}
  console.log('[scene] start:', name);
  scene.events.once('shutdown', () => {
    console.log('[scene] shutdown:', name);
    try { scene.tweens.killAll(); } catch (e) {}
    try { scene.time.removeAllEvents(); } catch (e) {}
    try { scene.input.removeAllListeners(); } catch (e) {}
    try { if (scene.input.keyboard) scene.input.keyboard.removeAllListeners(); } catch (e) {}
  });
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
  if (!scene.__toastStack) scene.__toastStack = [];
  const stack = scene.__toastStack;
  const yBase = H - 150;
  const t = scene.add.text(W / 2, yBase, msg, {
    fontFamily: FONT, fontSize: '20px', color: '#fff', fontStyle: 'bold',
    backgroundColor: '#3b2b20ee', padding: { x: 18, y: 10 }, align: 'center', wordWrap: { width: W * 0.82 }
  }).setOrigin(0.5).setDepth(200);
  stack.push(t);
  // Stack toasts upward (newest at the bottom) so overlapping rewards stay readable.
  const reflow = () => stack.forEach((o, i) => { if (o && o.active) o.y = yBase - (stack.length - 1 - i) * 46; });
  reflow();
  scene.tweens?.add({ targets: t, alpha: 0, delay: 2000, duration: 500, onComplete: () => {
    const idx = stack.indexOf(t);
    if (idx >= 0) stack.splice(idx, 1);
    t.destroy();
    reflow();
  }});
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
  scene.__hud = d; // remembered so refreshHUD() can rebuild it after rewards
  return d;
}

// Rebuild the top HUD in place so coin/star/level/XP reflect the latest state.
// No-op for scenes that never created a HUD.
export function refreshHUD(scene) {
  if (scene && scene.__hud) {
    try { scene.__hud.destroy(); } catch (e) {}
    scene.__hud = null;
    makeHUD(scene);
  }
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
  return gameButton(scene, 100, H - 110, 160, 60, '⬅ Back', COL.wood, onTap || (() => gotoScene(scene, 'WorldMapScene'))).setDepth(120);
}

// Compatibility aliases used by some scenes — real implementations, not stubs.
export function addBackButton(scene, targetScene = 'WorldMapScene') {
  return backButton(scene, () => gotoScene(scene, targetScene));
}
export function addBottomDock(scene, activeKey = '') { return makeDock(scene, activeKey); }
export function addPremiumHud(scene) { return makeHUD(scene); }

// ---- Douglas sprite support (optional) -------------------------------------
// All guarded: if the 'douglas_sheet' texture never loaded (no art committed),
// these no-op so callers keep their rectangle fallback. Never throws.
export function ensureDouglasAnims(scene) {
  try {
    if (!scene.textures.exists('douglas_sheet')) return false;
    if (!scene.anims.exists('douglas_idle')) {
      scene.anims.create({
        key: 'douglas_idle',
        frames: scene.anims.generateFrameNumbers('douglas_sheet', { start: 0, end: 2 }),
        frameRate: 4, repeat: -1, yoyo: true
      });
    }
    if (!scene.anims.exists('douglas_run')) {
      scene.anims.create({
        key: 'douglas_run',
        frames: scene.anims.generateFrameNumbers('douglas_sheet', { start: 0, end: 2 }),
        frameRate: 10, repeat: -1
      });
    }
    return true;
  } catch (e) { return false; }
}

// Returns a playing Douglas sprite if the sheet loaded, else null so the caller
// can fall back to its existing placeholder rectangle.
export function makeDouglasSprite(scene, x, y, anim = 'douglas_idle') {
  try {
    if (!ensureDouglasAnims(scene)) return null;
    const spr = scene.add.sprite(x, y, 'douglas_sheet', 0);
    if (scene.anims.exists(anim)) spr.play(anim);
    return spr;
  } catch (e) { return null; }
}

// ---- Hudson sprite support (optional) --------------------------------------
// Same guarded pattern as Douglas: no-ops to null if 'hudson_sheet' never loaded.
export function ensureHudsonAnims(scene) {
  try {
    if (!scene.textures.exists('hudson_sheet')) return false;
    if (!scene.anims.exists('hudson_idle')) {
      scene.anims.create({
        key: 'hudson_idle',
        frames: scene.anims.generateFrameNumbers('hudson_sheet', { start: 0, end: 2 }),
        frameRate: 4, repeat: -1, yoyo: true
      });
    }
    return true;
  } catch (e) { return false; }
}

export function makeHudsonSprite(scene, x, y, anim = 'hudson_idle') {
  try {
    if (!ensureHudsonAnims(scene)) return null;
    const spr = scene.add.sprite(x, y, 'hudson_sheet', 0);
    if (scene.anims.exists(anim)) spr.play(anim);
    return spr;
  } catch (e) { return null; }
}

// A code-drawn cartoon Hudson — no art asset needed, always available.
// Returns a container with setOutfit(color) which recolours just the shirt so
// outfit changes are visible (not a flat tint of the whole body). Never throws.
export function makeVectorHudson(scene, x, y, scale = 1) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  c.add(g);
  c.shirtColor = 0x81D4FA;
  c.redraw = function () {
    const skin = 0xF6C79B, hair = 0x6E4422, pants = 0x35415F, shoe = 0x2f2a26, mouth = 0x7a4a2a, eye = 0x2b2b2b;
    g.clear();
    // legs + shoes
    g.fillStyle(pants, 1);
    g.fillRoundedRect(-26, 40, 20, 62, 8);
    g.fillRoundedRect(6, 40, 20, 62, 8);
    g.fillStyle(shoe, 1);
    g.fillEllipse(-16, 106, 34, 18);
    g.fillEllipse(16, 106, 34, 18);
    // arms
    g.fillStyle(skin, 1);
    g.fillRoundedRect(-58, -16, 18, 70, 9);
    g.fillRoundedRect(40, -16, 18, 70, 9);
    // shirt (outfit colour)
    g.fillStyle(c.shirtColor, 1);
    g.fillRoundedRect(-46, -28, 92, 82, 24);
    // hands
    g.fillStyle(skin, 1);
    g.fillCircle(-49, 56, 11);
    g.fillCircle(49, 56, 11);
    // neck + head + ears
    g.fillStyle(skin, 1);
    g.fillRect(-11, -46, 22, 24);
    g.fillCircle(0, -74, 42);
    g.fillCircle(-42, -74, 9);
    g.fillCircle(42, -74, 9);
    // hair (top cap + fringe)
    g.fillStyle(hair, 1);
    g.beginPath(); g.arc(0, -74, 44, Math.PI, 2 * Math.PI); g.fillPath();
    g.fillRoundedRect(-44, -82, 88, 18, 9);
    // eyes + cheeks + smile
    g.fillStyle(eye, 1);
    g.fillCircle(-15, -78, 5);
    g.fillCircle(15, -78, 5);
    g.fillStyle(0xff9aa2, 0.55);
    g.fillCircle(-24, -66, 7);
    g.fillCircle(24, -66, 7);
    g.lineStyle(4, mouth, 1);
    g.beginPath(); g.arc(0, -68, 15, 0.15 * Math.PI, 0.85 * Math.PI); g.strokePath();
  };
  c.setOutfit = function (color) { if (typeof color === 'number') c.shirtColor = color; c.redraw(); };
  c.redraw();
  c.setScale(scale);
  return c;
}
