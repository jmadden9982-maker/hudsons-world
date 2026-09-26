import Phaser from 'phaser';
import { resetProgress, S } from '../systems/state.js';
import { button, COLORS, paintBackground, roundedPanel, textStyle, toast, toggleSetting, topBar } from '../ui/kit.js';
import { checkForUpdate, openReleasePage } from '../systems/UpdateCheck.js';

export default class SettingsScene extends Phaser.Scene {
  constructor() { super('SettingsScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0xb7a4ef, 0x7966b8); topBar(this, 'SETTINGS');
    roundedPanel(this, W / 2, 400, 620, 590, 0xfffbef, 0.98, 0x6c4ccf);
    this.add.text(W / 2, 135, 'Make the game feel right for Hudson', textStyle(18, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    toggleSetting(this, W / 2, 195, 'Music and sound', 'sound');
    toggleSetting(this, W / 2, 275, 'Read-to-me narration', 'narration');
    toggleSetting(this, W / 2, 355, 'Calm / reduced motion', 'calm');
    toggleSetting(this, W / 2, 435, 'Vibration', 'vibration');
    toggleSetting(this, W / 2, 515, 'Larger words', 'largeText');
    toggleSetting(this, W / 2, 595, 'Colour-safe clues', 'colourSafe');
    this.add.text(W / 2, 680, 'Games always use words and symbols, never colour alone.', textStyle(15, '#ffffff', { align: 'center', wordWrap: { width: 580 } })).setOrigin(0.5);
    button(this, 205, 770, 'REPLAY STORY', () => this.scene.start('IntroScene'), { width: 280, color: 0x47a8e8, fontSize: 18 });
    button(this, 515, 770, 'ABOUT', () => this.about(), { width: 280, color: 0x6c4ccf, fontSize: 18 });
    button(this, W / 2, 875, '🔐 PARENT CORNER', () => this.scene.start('ParentGateScene'), { width: 390, color: 0x40365f, fontSize: 19 });
    button(this, W / 2, 995, 'RESET ADVENTURE', () => this.confirmReset(), { width: 330, height: 60, color: 0xb84d4d, fontSize: 18 });
    this.add.text(W / 2, 1070, 'Progress and family captions stay only on this device.', textStyle(15, '#ffffff')).setOrigin(0.5);
    button(this, W / 2, 1155, '🔄 CHECK FOR UPDATES', () => this.checkUpdates(), { width: 380, height: 58, color: 0x249989, fontSize: 16 });
  }
  about() { toast(this, 'Made for Hudson, with Douglas, Finley, Mum, Dad and Baby Bell. No adverts. No pressure. Just play.', 0x40365f, 3200); }
  async checkUpdates() {
    toast(this, 'Checking for the newest build…', 0x249989, 1400);
    const { updateAvailable } = await checkForUpdate();
    if (!this.sys.isActive()) return;
    if (updateAvailable) this.showUpdateAvailable(); else toast(this, 'You’re already playing the newest build!', 0x40a95b, 2400);
  }
  showUpdateAvailable() {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(200);
    const backdrop = this.add.rectangle(W / 2, H / 2, W, H, 0x171126, 0.84).setInteractive();
    backdrop.once('pointerdown', () => ov.destroy());
    ov.add(backdrop);
    ov.add(roundedPanel(this, W / 2, H / 2, 600, 400, 0xfffbef, 1, 0x249989).setDepth(201));
    ov.add(this.add.text(W / 2, H / 2 - 130, '🔄', textStyle(60)).setOrigin(0.5).setDepth(202));
    ov.add(this.add.text(W / 2, H / 2 - 45, 'A new version is ready!', textStyle(26, COLORS.ink, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5).setDepth(202));
    ov.add(this.add.text(W / 2, H / 2 + 10, 'Open the download page, then install it like the first time to update.', textStyle(16, '#655a72', { align: 'center', wordWrap: { width: 490 } })).setOrigin(0.5).setDepth(202));
    ov.add(button(this, W / 2, H / 2 + 95, 'OPEN DOWNLOAD PAGE', () => openReleasePage(), { width: 340, height: 56, color: 0x249989, fontSize: 16, depth: 203 }));
    ov.add(button(this, W / 2, H / 2 + 165, 'CLOSE', () => ov.destroy(), { width: 220, height: 50, color: 0x8b7d78, depth: 203 }));
  }
  confirmReset() {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(200);
    ov.add(this.add.rectangle(W / 2, H / 2, W, H, 0x171126, 0.84).setInteractive());
    ov.add(roundedPanel(this, W / 2, H / 2, 600, 380, 0xfffbef, 1, 0xb84d4d).setDepth(201));
    ov.add(this.add.text(W / 2, H / 2 - 105, 'Start over?', textStyle(31, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(202));
    ov.add(this.add.text(W / 2, H / 2 - 35, 'This removes badges, stars and memories from this device.', textStyle(19, '#625773', { align: 'center', wordWrap: { width: 490 } })).setOrigin(0.5).setDepth(202));
    ov.add(button(this, W / 2 - 145, H / 2 + 95, 'CANCEL', () => ov.destroy(), { width: 240, color: 0x6c4ccf, depth: 203 }));
    ov.add(button(this, W / 2 + 145, H / 2 + 95, 'RESET', () => { resetProgress(); this.scene.start('MainMenuScene'); }, { width: 240, color: 0xb84d4d, depth: 203 }));
  }
}
