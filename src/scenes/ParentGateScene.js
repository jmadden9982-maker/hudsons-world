import Phaser from 'phaser';
import { button, COLORS, paintBackground, roundedPanel, textStyle, topBar } from '../ui/kit.js';

export default class ParentGateScene extends Phaser.Scene {
  constructor() { super('ParentGateScene'); }
  create() {
    if (sessionStorage.getItem('hudsonParentUnlocked') === 'yes') { this.scene.start('ParentZoneScene'); return; }
    const { width: W, height: H } = this.scale; paintBackground(this, 0x61547d, 0x3c3451); topBar(this, 'GROWN-UP CHECK');
    roundedPanel(this, W / 2, H / 2 - 30, 620, 650, 0xfffbef, 0.99, 0x6c4ccf);
    this.add.text(W / 2, H / 2 - 220, '🔐', textStyle(90)).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 120, 'Parent Corner', textStyle(33, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 45, 'Press and hold the button until the circle fills.', textStyle(20, '#655a72', { align: 'center', wordWrap: { width: 500 } })).setOrigin(0.5);
    const ring = this.add.circle(W / 2, H / 2 + 110, 92, 0xded6ed).setStrokeStyle(8, 0x6c4ccf);
    const hold = this.add.text(W / 2, H / 2 + 110, 'HOLD', textStyle(24, '#6c4ccf', { fontStyle: 'bold' })).setOrigin(0.5);
    const zone = this.add.zone(W / 2, H / 2 + 110, 200, 200).setInteractive({ useHandCursor: true });
    const cancel = () => { this.holdTimer?.remove(); this.holdTween?.stop(); ring.setScale(1); hold.setText('HOLD'); };
    zone.on('pointerdown', () => {
      hold.setText('KEEP HOLDING'); ring.setScale(0.75);
      this.holdTween = this.tweens.add({ targets: ring, scale: 1.18, duration: 2500 });
      this.holdTimer = this.time.delayedCall(2500, () => { sessionStorage.setItem('hudsonParentUnlocked', 'yes'); this.scene.start('ParentZoneScene'); });
    });
    zone.on('pointerup', cancel); zone.on('pointerout', cancel);
    button(this, W / 2, H / 2 + 290, 'BACK TO SETTINGS', () => this.scene.start('SettingsScene'), { width: 330, height: 60, color: 0x756a86, fontSize: 17 });
  }
}
