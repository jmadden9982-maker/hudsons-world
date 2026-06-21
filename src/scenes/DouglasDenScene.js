import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { addBackButton, sceneBg, makeDouglasSprite, gameButton, toast, FONT } from '../ui/kit.js';
import {
  applyDecay, petState, actions, mood,
  friendshipLevel, friendshipTitle, friendshipProgress,
  giftAvailable, claimDailyGift
} from '../systems/pet.js';
import { onPetDouglas, onTreatDouglas } from '../systems/progression.js';

const BARS = [
  { key: 'happiness', emoji: '❤️', color: 0xE5455E },
  { key: 'hunger',    emoji: '🍖', color: 0xE59A45 },
  { key: 'energy',    emoji: '⚡', color: 0x3FA7D6 }
];

export default class DouglasDenScene extends Phaser.Scene {
  constructor() { super('DouglasDenScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_playful');
    applyDecay();

    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_den')) {
      sceneBg(this, 'bg_den', 0xF5DEB3, 0xE8C99A);
      this.add.rectangle(0, 0, W, H, 0xF5DEB3, 0.3).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0xF5DEB3).setOrigin(0);
    }

    this.drawDenProps();

    // Douglas, larger and centered, with a gentle idle bob.
    this.douglas = makeDouglasSprite(this, W / 2, 560, 'douglas_idle');
    if (this.douglas) this.douglas.setScale(1.0);
    else this.douglas = this.add.rectangle(W / 2, 560, 150, 120, 0x8B4513);
    this.douglas.setDepth(10);
    this.douglasBaseY = 560;
    this.tweens.add({ targets: this.douglas, y: 560 - 12, duration: 950, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Speech bubble above Douglas.
    this.bubble = this.add.text(W / 2, 430, '', {
      fontFamily: FONT, fontSize: '22px', color: '#3b2b20', fontStyle: 'bold',
      backgroundColor: '#fffef5', padding: { x: 18, y: 12 }, align: 'center', wordWrap: { width: 360 }
    }).setOrigin(0.5).setDepth(40);

    // Stat bars (top-left).
    this.barG = this.add.graphics().setDepth(30);
    this.bx = 40; this.bw = 300; this.bh = 22;
    this.barRows = [108, 150, 192];
    BARS.forEach((b, i) => {
      this.add.text(this.bx, this.barRows[i] + this.bh / 2, b.emoji, { fontSize: '22px' }).setOrigin(0.5).setDepth(31);
    });

    // Friendship badge (top-right).
    this.friendText = this.add.text(W - 40, 110, '', {
      fontFamily: FONT, fontSize: '18px', color: '#3b2b20', fontStyle: 'bold', align: 'right'
    }).setOrigin(1, 0.5).setDepth(31).setShadow(0, 1, '#ffffff', 2);
    this.friendBarG = this.add.graphics().setDepth(30);

    // Daily gift button (only if available today).
    if (giftAvailable()) {
      this.giftBtn = gameButton(this, W - 120, 180, 200, 56, '🎁 Daily Gift!', 0xF6B43C, () => this.openGift());
      this.giftBtn.setDepth(60);
      this.tweens.add({ targets: this.giftBtn, scale: 1.06, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    // Care actions.
    const defs = [
      { k: 'pet',   label: '🤚 Pet',   color: 0x9B6DD7 },
      { k: 'feed',  label: '🍖 Feed',  color: 0xE59A45 },
      { k: 'fetch', label: '🎾 Fetch', color: 0x5BA838 },
      { k: 'brush', label: '🧴 Brush', color: 0x3FA7D6 },
      { k: 'sleep', label: '😴 Sleep', color: 0x6E4422 }
    ];
    const bw = 128, gap = 12, total = defs.length * bw + (defs.length - 1) * gap;
    let x = (W - total) / 2 + bw / 2;
    defs.forEach(d => {
      gameButton(this, x, 1062, bw, 66, d.label, d.color, () => this.doAction(d.k)).setDepth(50);
      x += bw + gap;
    });

    addBackButton(this);
    this.refresh();
  }

  doAction(kind) {
    const r = actions[kind]();
    // Keep the Phase-10F progression flow alive (Best Friend achievement, first-Douglas photo/journal).
    if (kind === 'pet') onPetDouglas(this);
    else if (kind === 'feed') onTreatDouglas(this);
    // Douglas reacts with a little hop.
    this.tweens.add({ targets: this.douglas, y: this.douglasBaseY - 40, duration: 160, yoyo: true, ease: 'Quad.easeOut' });
    this.setBubble(r.line);
    if (r.lvlUp) {
      AudioManager.playSfx('achievement');
      toast(this, '🤝 Friendship Level ' + r.lvlUp + '! ' + friendshipTitle());
    }
    this.refresh();
    // Revert the bubble to the current mood after a moment.
    this.time.delayedCall(1600, () => { if (this.bubble && this.bubble.active) this.setBubble(mood().line); });
  }

  openGift() {
    const r = claimDailyGift(this);
    if (!r) return;
    this.setBubble(r.line);
    if (this.giftBtn) { this.giftBtn.destroy(); this.giftBtn = null; }
    this.refresh();
    this.time.delayedCall(2200, () => { if (this.bubble && this.bubble.active) this.setBubble(mood().line); });
  }

  setBubble(text) { if (this.bubble) this.bubble.setText(text); }

  refresh() {
    const p = petState();
    // Stat bars.
    this.barG.clear();
    BARS.forEach((b, i) => {
      const y = this.barRows[i];
      const x0 = this.bx + 30;
      this.barG.fillStyle(0x000000, 0.28); this.barG.fillRoundedRect(x0, y, this.bw, this.bh, 11);
      const frac = Math.max(0, Math.min(1, p[b.key] / 100));
      this.barG.fillStyle(b.color, 1); this.barG.fillRoundedRect(x0, y, Math.max(6, this.bw * frac), this.bh, 11);
      this.barG.lineStyle(2, 0xffffff, 0.7); this.barG.strokeRoundedRect(x0, y, this.bw, this.bh, 11);
    });

    // Friendship badge + progress bar.
    this.friendText.setText('🤝 Lv ' + friendshipLevel() + '  ' + friendshipTitle());
    const { width: W } = this.scale;
    const fx = W - 240, fy = 130, fw = 200, fh = 12;
    this.friendBarG.clear();
    this.friendBarG.fillStyle(0x000000, 0.28); this.friendBarG.fillRoundedRect(fx, fy, fw, fh, 6);
    this.friendBarG.fillStyle(0x5BA838, 1); this.friendBarG.fillRoundedRect(fx, fy, Math.max(4, fw * friendshipProgress()), fh, 6);

    if (!this.bubble.text) this.setBubble(mood().line);
  }

  // Static decorative props (dog bed, bone, food bowl, ball, toy box) drawn behind Douglas.
  drawDenProps() {
    const { width, height } = this.scale;
    const g = this.add.graphics().setDepth(-10);
    g.fillStyle(0x8B5A2B, 1); g.fillEllipse(width / 2, 700, 250, 74);
    g.fillStyle(0xC68A4E, 1); g.fillEllipse(width / 2, 696, 188, 48);
    const baseY = 770;
    const props = [
      { e: '🦴', x: width / 2 - 150, y: baseY },
      { e: '🥣', x: width / 2 - 60,  y: baseY + 8 },
      { e: '🎾', x: width / 2 + 60,  y: baseY + 4 },
      { e: '🧺', x: width / 2 + 150, y: baseY - 6 }
    ];
    props.forEach(p => this.add.text(p.x, p.y, p.e, { fontSize: '40px' }).setOrigin(0.5).setDepth(-9));
  }
}
