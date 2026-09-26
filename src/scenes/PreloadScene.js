import Phaser from 'phaser';
import { FONT } from '../ui/kit.js';
import { CHARACTER_ART } from '../data/characters.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }
  preload() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x171126).setOrigin(0);
    this.add.circle(W / 2, H / 2 - 115, 100, 0xffd447);
    this.add.text(W / 2, H / 2 - 125, 'H', { fontFamily: FONT, fontSize: '124px', color: '#6c4ccf', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 + 20, 'Building Hudson’s World…', { fontFamily: FONT, fontSize: '23px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    const track = this.add.rectangle(W / 2, H / 2 + 90, 430, 20, 0xffffff, 0.16).setStrokeStyle(2, 0xffffff, 0.25);
    const fill = this.add.rectangle(W / 2 - 209, H / 2 + 90, 4, 12, 0xffd447).setOrigin(0, 0.5);
    const amount = this.add.text(W / 2, H / 2 + 130, '0%', { fontFamily: FONT, fontSize: '16px', color: '#bcb3d4' }).setOrigin(0.5);
    this.load.on('progress', (value) => {
      fill.width = Math.max(4, 418 * value);
      amount.setText(`${Math.round(value * 100)}%`);
    });
    this.load.on('complete', () => { track.setStrokeStyle(2, 0xffd447, 0.8); amount.setText('Adventure ready!'); });
    const assets = {
      'premium-title': 'assets/premium/title-world.png',
      'premium-icon': 'assets/premium/app-icon.png'
    };
    Object.entries(assets).forEach(([key, path]) => this.load.image(key, path));
    // Character spritesheets are reused across almost every scene (unlike the
    // per-adventure premium backdrops, which are large, single-use and lazy-
    // loaded), so they're preloaded once here rather than per scene.
    Object.entries(CHARACTER_ART).forEach(([id, art]) => {
      this.load.spritesheet(art.texture, `assets/characters/${id}.png`, { frameWidth: art.frameWidth, frameHeight: art.frameHeight });
    });
  }
  create() {
    const { width: W, height: H } = this.scale;
    this.children.removeAll();
    const bg = this.add.image(W / 2, H / 2, 'premium-title').setDisplaySize(W, H);
    this.add.rectangle(W / 2, H / 2, W, H, 0x171126, 0.28);
    this.add.rectangle(W / 2, 145, W, 290, 0x171126, 0.26);
    this.add.text(W / 2, 112, "HUDSON'S", { fontFamily: FONT, fontSize: '53px', color: '#ffffff', fontStyle: 'bold', stroke: '#241747', strokeThickness: 9 }).setOrigin(0.5);
    this.add.text(W / 2, 177, 'WORLD', { fontFamily: FONT, fontSize: '73px', color: '#ffd447', fontStyle: 'bold', stroke: '#241747', strokeThickness: 10 }).setOrigin(0.5);
    const line = this.add.text(W / 2, 240, 'A BIG WORLD. ONE BRAVE TEAM.', { fontFamily: FONT, fontSize: '18px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setAlpha(0);
    bg.setScale(bg.scaleX * 1.03, bg.scaleY * 1.03);
    this.tweens.add({ targets: bg, scaleX: bg.scaleX / 1.03, scaleY: bg.scaleY / 1.03, duration: 1250, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: line, alpha: 1, y: 246, duration: 600, delay: 250 });
    this.cameras.main.fadeIn(450, 23, 17, 38);
    this.time.delayedCall(1200, () => this.scene.start('MainMenuScene'));
  }
}
