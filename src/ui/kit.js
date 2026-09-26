import Phaser from 'phaser';
import { S, campaignBadges, persist, titleForLevel, totalZoneStars, xpNeed } from '../systems/state.js';
import AudioManager from '../systems/AudioManager.js';
import { HapticManager } from '../systems/HapticManager.js';

export const FONT = 'Trebuchet MS, Arial, sans-serif';
export const COLORS = { ink: '#2a2140', cream: '#fff8e8', yellow: '#ffd447', purple: '#6c4ccf', green: '#40a95b', blue: '#47a8e8', coral: '#f36f5f', brown: '#6b4325' };
export function textStyle(size = 24, color = COLORS.ink, extra = {}) {
  const readableSize = S.settings.largeText ? Math.round(size * 1.1) : size;
  return { fontFamily: FONT, fontSize: `${readableSize}px`, color, ...extra };
}

export function paintBackground(scene, top = 0x7ed7f5, bottom = 0x8ed66f) {
  const { width: W, height: H } = scene.scale;
  scene.add.rectangle(0, 0, W, H, top).setOrigin(0).setDepth(-20);
  scene.add.circle(90, 150, 70, 0xffef8a, 0.9).setDepth(-19);
  for (let i = 0; i < 7; i += 1) scene.add.circle(50 + i * 120, H * 0.72 + (i % 2) * 25, 150, bottom).setDepth(-18);
}

export function queuePremiumBackdrop(scene, key, path) {
  if (scene.textures.exists(key)) return;
  const { width: W, height: H } = scene.scale;
  const overlay = scene.add.container(0, 0).setDepth(1000);
  overlay.add(scene.add.rectangle(W / 2, H / 2, W, H, 0x171126, 1));
  overlay.add(scene.add.text(W / 2, H / 2 - 40, '✨', textStyle(58)).setOrigin(0.5));
  const label = scene.add.text(W / 2, H / 2 + 42, 'Opening this world…', textStyle(18, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
  overlay.add(label);
  scene.load.image(key, path);
  const onProgress = (value) => label.setText(`Opening this world… ${Math.round(value * 100)}%`);
  scene.load.on('progress', onProgress);
  scene.load.once('complete', () => { scene.load.off('progress', onProgress); overlay.destroy(); });
}

export function premiumBackdrop(scene, key, options = {}) {
  const { width: W, height: H } = scene.scale;
  const source = scene.textures.get(key).getSourceImage();
  const scale = Math.max(W / source.width, H / source.height);
  const image = scene.add.image(W / 2, H / 2, key).setScale(scale).setDepth(options.depth ?? -30);
  if (options.tint) image.setTint(options.tint);
  const shade = options.shade ?? 0.08;
  if (shade > 0) scene.add.rectangle(W / 2, H / 2, W, H, options.shadeColor || 0x171126, shade).setDepth((options.depth ?? -30) + 1);
  const vignette = scene.add.graphics().setDepth((options.depth ?? -30) + 2);
  vignette.fillGradientStyle(0x151025, 0x151025, 0x151025, 0x151025, 0.18, 0.18, 0.02, 0.02);
  vignette.fillRect(0, 0, W, 220);
  vignette.fillGradientStyle(0x151025, 0x151025, 0x151025, 0x151025, 0.01, 0.01, 0.42, 0.42);
  vignette.fillRect(0, H - 320, W, 320);
  if (!S.settings.calm && options.drift !== false) {
    scene.tweens.add({ targets: image, scaleX: scale * 1.025, scaleY: scale * 1.025, duration: 9000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  if (options.transient) {
    scene.events.once('shutdown', () => {
      window.setTimeout(() => {
        if (!scene.scene.isActive(scene.scene.key) && scene.textures.exists(key)) scene.textures.remove(key);
      }, 0);
    });
  }
  scene.cameras.main.fadeIn(300, 20, 14, 36);
  return image;
}

export function ambientMotes(scene, options = {}) {
  if (S.settings.calm) return [];
  const { width: W, height: H } = scene.scale;
  const count = options.count || 14; const color = options.color || 0xffe89b;
  return Array.from({ length: count }, (_, i) => {
    const mote = scene.add.circle(Phaser.Math.Between(20, W - 20), Phaser.Math.Between(150, H - 120), Phaser.Math.Between(2, 5), color, Phaser.Math.FloatBetween(0.15, 0.5)).setDepth(options.depth ?? -2);
    scene.tweens.add({ targets: mote, y: mote.y - Phaser.Math.Between(35, 95), x: mote.x + Phaser.Math.Between(-25, 25), alpha: 0.05, duration: 2600 + i * 170, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    return mote;
  });
}

export function roundedPanel(scene, x, y, width, height, color = 0xffffff, alpha = 0.96, stroke = 0x46376e) {
  const g = scene.add.graphics();
  g.fillStyle(0x090612, 0.25); g.fillRoundedRect(x - width / 2 + 7, y - height / 2 + 10, width, height, 24);
  g.fillStyle(color, alpha); g.fillRoundedRect(x - width / 2, y - height / 2, width, height, 22);
  g.lineStyle(4, stroke, 0.95); g.strokeRoundedRect(x - width / 2, y - height / 2, width, height, 22);
  g.lineStyle(2, 0xffffff, 0.42); g.strokeRoundedRect(x - width / 2 + 5, y - height / 2 + 5, width - 10, height - 10, 18);
  return g;
}

export function button(scene, x, y, label, onPress, options = {}) {
  const width = options.width || 240; const height = options.height || 74; const color = options.color || 0x6c4ccf;
  const container = scene.add.container(x, y).setDepth(options.depth || 5);
  const shadow = scene.add.graphics(); shadow.fillStyle(0x090612, 0.38); shadow.fillRoundedRect(-width / 2 + 2, -height / 2 + 9, width, height, 19);
  const bg = scene.add.graphics(); bg.fillStyle(color, 1); bg.fillRoundedRect(-width / 2, -height / 2, width, height, 18); bg.fillStyle(0xffffff, 0.13); bg.fillRoundedRect(-width / 2 + 6, -height / 2 + 5, width - 12, Math.max(12, height * 0.36), 13); bg.lineStyle(3, 0xffffff, 0.68); bg.strokeRoundedRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4, 16);
  const txt = scene.add.text(0, 0, label, textStyle(options.fontSize || 24, '#ffffff', { fontStyle: 'bold', align: 'center' })).setOrigin(0.5);
  container.add([shadow, bg, txt]); container.setSize(width, height).setInteractive({ useHandCursor: true });
  container.on('pointerover', () => scene.tweens.add({ targets: container, scale: 1.035, duration: 100, ease: 'Sine.easeOut' }));
  container.on('pointerout', () => scene.tweens.add({ targets: container, scale: 1, duration: 100, ease: 'Sine.easeOut' }));
  container.on('pointerdown', () => {
    if (scene.__buttonBusy) return;
    scene.__buttonBusy = true;
    AudioManager.playSfx(options.sound || 'button_click'); HapticManager.tap();
    scene.tweens.add({ targets: container, scale: 0.93, duration: 75, yoyo: true, ease: 'Sine.easeInOut', onComplete: () => { scene.__buttonBusy = false; onPress?.(); } });
  });
  return container;
}

export function topBar(scene, title, { back = true, settings = false } = {}) {
  const { width: W } = scene.scale;
  const bar = scene.add.rectangle(W / 2, 49, W - 24, 78, 0x211b3c, 0.94).setStrokeStyle(3, 0xffffff, 0.25).setDepth(30);
  scene.add.text(W / 2, 49, title, textStyle(24, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(31);
  if (back) button(scene, 65, 49, '‹', () => scene.scene.start('WorldMapScene'), { width: 66, height: 56, fontSize: 38, color: 0x473a78, depth: 32 });
  if (settings) button(scene, W - 65, 49, '⚙', () => scene.scene.start('SettingsScene'), { width: 66, height: 56, fontSize: 27, color: 0x473a78, depth: 32 });
  return bar;
}

export function hud(scene, options = {}) {
  const { width: W } = scene.scale; const y = options.y || 108;
  roundedPanel(scene, W / 2, y, W - 44, 58, 0xffffff, 0.94, 0xd7c8ff).setDepth(24);
  scene.add.text(42, y, `⭐ ${S.stars}`, textStyle(20, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5).setDepth(25);
  scene.add.text(W / 2, y, `🏅 ${campaignBadges()}/5   ✨ ${totalZoneStars()}/15`, textStyle(18, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(25);
  scene.add.text(W - 42, y, `🦴 ${S.bones}`, textStyle(20, COLORS.ink, { fontStyle: 'bold' })).setOrigin(1, 0.5).setDepth(25);
}

export function progressBar(scene, x, y, width, value, max, color = 0x48b96b) {
  const ratio = Phaser.Math.Clamp(max ? value / max : 0, 0, 1);
  scene.add.rectangle(x, y, width, 18, 0x1d1330, 0.18).setOrigin(0.5);
  scene.add.rectangle(x - width / 2 + 3, y, Math.max(2, (width - 6) * ratio), 12, color).setOrigin(0, 0.5);
}

export function playerCard(scene, x, y) {
  roundedPanel(scene, x, y, 610, 102, 0xffffff, 0.96, 0xffd447);
  scene.add.text(x - 275, y - 20, `HUDSON · LEVEL ${S.level}`, textStyle(19, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
  scene.add.text(x - 275, y + 18, titleForLevel(), textStyle(15, '#6f6385')).setOrigin(0, 0.5);
  progressBar(scene, x + 110, y + 15, 220, S.xp, xpNeed());
  scene.add.text(x + 110, y - 17, `${S.xp} / ${xpNeed()} XP`, textStyle(14, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
}

export function toast(scene, message, color = 0x211b3c, duration = 1200) {
  const { width: W, height: H } = scene.scale; const c = scene.add.container(W / 2, H - 145).setDepth(400);
  const bg = scene.add.graphics(); bg.fillStyle(color, 0.97); bg.fillRoundedRect(-270, -34, 540, 68, 18);
  const t = scene.add.text(0, 0, message, textStyle(19, '#ffffff', { fontStyle: 'bold', align: 'center', wordWrap: { width: 500 } })).setOrigin(0.5);
  c.add([bg, t]); c.setAlpha(0); scene.tweens.add({ targets: c, alpha: 1, y: H - 160, duration: 180 });
  scene.time.delayedCall(duration, () => scene.tweens.add({ targets: c, alpha: 0, duration: 180, onComplete: () => c.destroy() })); return c;
}

export function starRow(scene, x, y, count, size = 44) { for (let i = 0; i < 3; i += 1) scene.add.text(x + (i - 1) * (size + 10), y, i < count ? '⭐' : '☆', textStyle(size, i < count ? '#ffffff' : '#d7cde7')).setOrigin(0.5); }

export function showAdventureResult(scene, data) {
  const { width: W, height: H } = scene.scale; const overlay = scene.add.container(0, 0).setDepth(200);
  overlay.add(scene.add.rectangle(W / 2, H / 2, W, H, 0x160f2a, 0.84).setInteractive());
  overlay.add(roundedPanel(scene, W / 2, H / 2, 610, 610, 0xfffbef, 1, 0xffd447).setDepth(201));
  overlay.add(scene.add.text(W / 2, H / 2 - 235, data.title || 'Adventure Complete!', textStyle(34, COLORS.ink, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5).setDepth(202));
  overlay.add(scene.add.text(W / 2, H / 2 - 180, data.message || 'Brilliant work, Hudson!', textStyle(19, '#6f6385', { align: 'center', wordWrap: { width: 510 } })).setOrigin(0.5).setDepth(202));
  starRow(scene, W / 2, H / 2 - 105, data.stars || 1, 58);
  overlay.add(scene.add.text(W / 2, H / 2 - 10, `${data.scoreLabel || 'Score'}: ${data.score}`, textStyle(25, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(202));
  overlay.add(scene.add.text(W / 2, H / 2 + 45, data.rewardText || 'Your adventure has been saved.', textStyle(18, '#3c8c50', { fontStyle: 'bold', align: 'center', wordWrap: { width: 500 } })).setOrigin(0.5).setDepth(202));
  overlay.add(button(scene, W / 2, H / 2 + 145, 'PLAY AGAIN', data.onReplay, { width: 270, color: 0x47a8e8, depth: 203 }));
  overlay.add(button(scene, W / 2, H / 2 + 235, 'BACK TO MAP', () => scene.scene.start('WorldMapScene'), { width: 270, color: 0x40a95b, depth: 203 }));
  if (!S.settings.calm) {
    for (let i = 0; i < 26; i += 1) {
      const confetti = scene.add.rectangle(Phaser.Math.Between(30, W - 30), Phaser.Math.Between(-160, -20), Phaser.Math.Between(7, 14), Phaser.Math.Between(14, 28), Phaser.Utils.Array.GetRandom([0xffd447, 0xf36f5f, 0x47a8e8, 0x40a95b, 0x9b70d9])).setDepth(204).setAngle(Phaser.Math.Between(0, 180));
      overlay.add(confetti);
      scene.tweens.add({ targets: confetti, y: H + 80, x: confetti.x + Phaser.Math.Between(-90, 90), angle: confetti.angle + Phaser.Math.Between(180, 540), duration: Phaser.Math.Between(1800, 3000), delay: i * 35, onComplete: () => confetti.destroy() });
    }
  }
  return overlay;
}

export function toggleSetting(scene, x, y, label, key, onChanged) {
  const value = S.settings[key]; scene.add.text(x - 250, y, label, textStyle(21, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
  return button(scene, x + 205, y, value ? 'ON' : 'OFF', () => { S.settings[key] = !S.settings[key]; persist(); onChanged?.(); scene.scene.restart(); }, { width: 130, height: 58, color: value ? 0x40a95b : 0x8d829f, fontSize: 19 });
}

export const makeHUD = hud;
export const addPremiumHud = hud;
export const sceneBg = (scene, key, top, bottom) => paintBackground(scene, top, bottom);
export const addBackButton = (scene) => button(scene, 72, scene.scale.height - 58, '‹ MAP', () => scene.scene.start('WorldMapScene'), { width: 125, height: 54, fontSize: 18 });
export const makeDock = () => null;
export const addBottomDock = () => null;
