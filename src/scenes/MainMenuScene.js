import Phaser from 'phaser';
import { S, campaignBadges } from '../systems/state.js';
import { ambientMotes, button, COLORS, playerCard, premiumBackdrop, roundedPanel, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }
  create() {
    AudioManager.setScene(this);
    const { width: W, height: H } = this.scale;
    premiumBackdrop(this, 'premium-title', { shade: 0.12 }); ambientMotes(this, { count: 18, color: 0xffe38d, depth: 1 });
    this.add.rectangle(W / 2, 145, W, 290, 0x171126, 0.34).setDepth(2);
    this.add.text(W / 2, 91, "HUDSON'S", textStyle(52, '#ffffff', { fontStyle: 'bold', stroke: '#241747', strokeThickness: 9 })).setOrigin(0.5).setDepth(3);
    this.add.text(W / 2, 157, 'WORLD', textStyle(72, COLORS.yellow, { fontStyle: 'bold', stroke: '#241747', strokeThickness: 10 })).setOrigin(0.5).setDepth(3);
    this.add.text(W / 2, 219, 'THE BIG FAMILY ADVENTURE', textStyle(17, '#ffffff', { fontStyle: 'bold', letterSpacing: 2 })).setOrigin(0.5).setDepth(3);
    const badge = roundedPanel(this, W / 2, 642, 560, 108, 0x211b3c, 0.88, 0xffd447).setDepth(3);
    this.add.text(W / 2, 620, S.plays ? `${campaignBadges()} OF 5 WORLD BADGES FOUND` : 'A BRAND-NEW WORLD IS WAITING', textStyle(19, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(4);
    this.add.text(W / 2, 660, S.plays ? `${S.stars} stars • ${S.bones} Douglas bones • Progress saved` : 'Explore • Rescue • Build • Discover', textStyle(15, '#d8cffa')).setOrigin(0.5).setDepth(4);
    button(this, W / 2, 755, S.plays ? 'CONTINUE ADVENTURE' : 'BEGIN THE ADVENTURE', () => this.scene.start(S.seenIntro ? 'WorldMapScene' : 'IntroScene'), { width: 470, height: 84, color: 0x40a95b, fontSize: 25, sound: 'button_confirm', depth: 6 });
    button(this, 205, 860, '🏠  HUDSON HOUSE', () => this.scene.start('HudsonHouseScene'), { width: 285, height: 68, color: 0xf36f5f, fontSize: 18, depth: 6 });
    button(this, 515, 860, '⚙  SETTINGS', () => this.scene.start('SettingsScene'), { width: 285, height: 68, color: 0x6c4ccf, fontSize: 18, depth: 6 });
    playerCard(this, W / 2, 1010);
    this.add.text(W / 2, 1105, 'HUDSON  •  DOUGLAS  •  FINLEY  •  MUM  •  DAD  •  BABY BELL', textStyle(13, '#ffffff', { fontStyle: 'bold', stroke: '#241747', strokeThickness: 4 })).setOrigin(0.5).setDepth(4);
    this.add.text(W / 2, H - 62, 'NO ADVERTS  •  NO PURCHASES  •  JUST ADVENTURE', textStyle(13, '#ffffff', { fontStyle: 'bold', backgroundColor: 'rgba(23,17,38,0.62)', padding: { x: 16, y: 9 } })).setOrigin(0.5).setDepth(4);
    this.tweens.add({ targets: badge, alpha: { from: 0.7, to: 1 }, duration: 1400, yoyo: true, repeat: -1 });
  }
}
