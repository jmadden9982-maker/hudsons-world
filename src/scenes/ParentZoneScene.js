import Phaser from 'phaser';
import { S, persist } from '../systems/state.js';
import { button, COLORS, paintBackground, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';

export default class ParentZoneScene extends Phaser.Scene {
  constructor() { super('ParentZoneScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x776898, 0x4d4265); topBar(this, 'PARENT CORNER');
    roundedPanel(this, W / 2, 360, 620, 470, 0xfffbef, 0.99, 0x6c4ccf);
    this.add.text(W / 2, 170, 'On-device controls', textStyle(25, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 215, 'No accounts, adverts, tracking or cloud uploads.', textStyle(16, '#655a72', { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(95, 295, 'Gentle break reminder', textStyle(20, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
    button(this, 545, 295, S.settings.breakReminder ? 'ON' : 'OFF', () => { S.settings.breakReminder = !S.settings.breakReminder; persist(); this.scene.restart(); }, { width: 150, height: 58, color: S.settings.breakReminder ? 0x40a95b : 0x81788e, fontSize: 18 });
    this.add.text(95, 380, 'Reminder timing', textStyle(20, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
    button(this, 530, 380, `${S.settings.breakMinutes || 20} MIN`, () => { const times = [20, 30, 45]; const i = times.indexOf(S.settings.breakMinutes); S.settings.breakMinutes = times[(i + 1) % times.length]; persist(); this.scene.restart(); }, { width: 180, height: 58, color: 0x6c4ccf, fontSize: 17 });
    this.add.text(W / 2, 470, 'The reminder is off by default and never stops play.', textStyle(15, '#655a72')).setOrigin(0.5);
    button(this, W / 2, 625, '✏️ EDIT PHOTO CAPTIONS', () => this.scene.start('PhotoCaptionScene'), { width: 430, color: 0x47a8e8, fontSize: 20 });
    button(this, W / 2, 725, '📖 REPLAY INTRO STORY', () => this.scene.start('IntroScene'), { width: 430, color: 0x6c4ccf, fontSize: 20 });
    button(this, W / 2, 825, '🔒 LOCK PARENT CORNER', () => { sessionStorage.removeItem('hudsonParentUnlocked'); toast(this, 'Parent Corner locked.', 0x40365f); this.time.delayedCall(550, () => this.scene.start('SettingsScene')); }, { width: 430, color: 0x756a86, fontSize: 19 });
    this.add.text(W / 2, 965, 'Privacy', textStyle(21, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 1025, 'Progress, caption changes and settings stay on this device.\nHudson’s World does not send personal information anywhere.', textStyle(17, '#ffffff', { align: 'center', wordWrap: { width: 590 }, lineSpacing: 7 })).setOrigin(0.5);
  }
}
