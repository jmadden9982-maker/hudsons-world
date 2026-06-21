import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, COL, sceneBg, addBackButton, gameButton, toast } from '../ui/kit.js';
import { grantReward, addJournal } from '../systems/progression.js';
import { petState } from '../systems/pet.js';
import { track } from '../systems/family.js';

const TOTAL = 8;

export default class BoneHuntScene extends Phaser.Scene {
  constructor() { super('BoneHuntScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_playful');
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_den')) {
      sceneBg(this, 'bg_den', 0xF5DEB3, 0xE8C99A);
      this.add.rectangle(0, 0, W, H, 0xF5DEB3, 0.35).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0xF5DEB3).setOrigin(0);
    }

    this.add.text(W / 2, 60, '🦴 Bone Hunt', { fontFamily: FONT, fontSize: '28px', color: '#3b2b20', fontStyle: 'bold' }).setOrigin(0.5);
    this.found = 0;
    this.countText = this.add.text(W / 2, 100, 'Tap the bones!  0 / ' + TOTAL, { fontFamily: FONT, fontSize: '18px', color: '#5a4632', fontStyle: 'bold' }).setOrigin(0.5);

    // Scatter bones in the play area (clear of title and the bottom back button).
    this.bones = [];
    for (let i = 0; i < TOTAL; i++) {
      const x = Phaser.Math.Between(70, W - 70);
      const y = Phaser.Math.Between(190, H - 240);
      const b = this.add.text(x, y, '🦴', { fontSize: '46px' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      this.tweens.add({ targets: b, angle: Phaser.Math.Between(-12, 12), duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      b.on('pointerdown', () => this.grab(b));
      this.bones.push(b);
    }

    addBackButton(this);
  }

  grab(b) {
    if (!b.active) return;
    AudioManager.playSfx('bone_collect');
    this.found++;
    this.countText.setText('Tap the bones!  ' + this.found + ' / ' + TOTAL);
    this.tweens.add({ targets: b, scale: 1.4, alpha: 0, duration: 180, onComplete: () => b.destroy() });
    if (this.found >= TOTAL) this.finish();
  }

  finish() {
    const p = petState(); p.happiness = Math.min(100, p.happiness + 12);
    track('bones', TOTAL);
    addJournal('bone_hunt_win', '🦴', 'Bone Hunter', 'Hudson found a whole pile of bones for Douglas!');
    grantReward(this, TOTAL * 5, 12, 'All bones found! Douglas is thrilled!');
    AudioManager.playSfx('douglas_happy');
    const { width: W, height: H } = this.scale;
    gameButton(this, W / 2 - 110, H - 200, 200, 60, '🔁 Again', COL.green, () => this.scene.restart()).setDepth(60);
    gameButton(this, W / 2 + 110, H - 200, 200, 60, '🎮 Games', COL.wood, () => this.scene.start('GamesHubScene')).setDepth(60);
  }
}
