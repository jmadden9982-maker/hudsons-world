import Phaser from 'phaser';
import { FONT, addPremiumHud, addBottomDock, makeDouglasSprite } from '../ui/kit.js';
import { S } from '../systems/state.js';
import { feel } from '../systems/feel.js';

export default class HudsonHouseScene extends Phaser.Scene {
  constructor() { super('HudsonHouseScene'); }

  create() {
    const { width: W, height: H } = this.scale;

    // Painted background (with fallback)
    if (this.textures.exists('bg_house')) {
      const bg = this.add.image(W/2, H/2, 'bg_house');
      const sc = Math.max(W / bg.width, H / bg.height);
      bg.setScale(sc).setDepth(-100);
    } else {
      // Fallback cosy room
      this.add.rectangle(0, 0, W, H, 0xFFF1DA).setOrigin(0);
      this.add.rectangle(0, H-130, W, 130, 0xC79A66).setOrigin(0);
    }

    feel(this, 'button_confirm', 'soft');
    addPremiumHud(this);
    addBottomDock(this, 'HudsonHouseScene');

    this.add.text(W / 2, 56, '🏡 Hudson House', {
      fontFamily: FONT,
      fontSize: '28px',
      color: '#7a4a00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    if (S.journal[0]) {
      this.add.text(70, 110, '📌 "' + S.journal[0].title + '"', {
        fontFamily: FONT,
        fontSize: '14px',
        color: '#7a5a28',
        fontStyle: 'bold',
        wordWrap: { width: 220 }
      });
    }

    // ==================== DAILY CHEST (Large & Working) ====================
    const chestContainer = this.add.container(W / 2, 200);
    const chestBg = this.add.rectangle(0, 0, 220, 90, 0x8B4513).setStrokeStyle(4, 0xFFD23F);
    const chestLabel = this.add.text(0, -5, '🎁 Daily Reward Chest', {
      fontFamily: FONT,
      fontSize: '20px',
      color: '#FFD23F',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    const chestHint = this.add.text(0, 22, 'Tap to claim!', {
      fontFamily: FONT,
      fontSize: '14px',
      color: '#FFE9C9'
    }).setOrigin(0.5);

    chestContainer.add([chestBg, chestLabel, chestHint]);
    chestContainer.setSize(220, 90).setInteractive({ useHandCursor: true });

    chestContainer.on('pointerdown', () => {
      feel(this, 'button_confirm', 'success');
      this.openDailyChest();
    });

    // ==================== OTHER INTERACTIVE AREAS ====================
    const spots = [
      { e: '📖', n: 'Storybook Desk', go: 'AdventureJournalScene' },
      { e: '📸', n: 'Photo Frames', go: 'FamilyPhotoWallScene' },
      { e: '🛏️', n: "Douglas' Bed", go: 'DouglasDenScene' },
      { e: '🏆', n: 'Trophy Shelf', go: 'TrophyRoomScene' },
      { e: '👕', n: 'Wardrobe Corner', go: 'WardrobeScene' }
    ];

    const cols = 3;
    const cw = 150;
    const ch = 110;
    const gx = (W - cols * cw) / 2 + cw / 2;
    const gy = 320;

    spots.forEach((s, i) => {
      const x = gx + (i % cols) * cw;
      const y = gy + Math.floor(i / cols) * ch;

      const c = this.add.container(x, y);
      const card = this.add.rectangle(0, 0, 130, 90, 0xFFFFFF).setStrokeStyle(3, 0xE0A86B);
      c.add([card,
        this.add.text(0, -15, s.e, { fontSize: '32px' }).setOrigin(0.5),
        this.add.text(0, 20, s.n, { fontFamily: FONT, fontSize: '14px', color: '#3b2b20', fontStyle: 'bold' }).setOrigin(0.5)
      ]);
      c.setSize(130, 90).setInteractive({ useHandCursor: true });
      c.on('pointerdown', () => {
        feel(this, 'button_click', 'tap');
        this.scene.start(s.go);
      });
    });

    // Douglas (real sprite if loaded, else the small placeholder). Kept above the
    // bottom dock (dock occupies the lower 64px) and tappable to visit his den.
    let douglas = makeDouglasSprite(this, W - 110, H - 150, 'douglas_idle');
    if (douglas) {
      douglas.setScale(0.38);
      this.tweens.add({ targets: douglas, y: douglas.y - 8, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else {
      douglas = this.add.rectangle(W - 120, H - 120, 80, 60, 0x8B4513);
      this.add.text(W - 120, H - 120, '🐕 Douglas', { fontSize: '16px', color: '#fff' }).setOrigin(0.5);
    }
    douglas.setInteractive({ useHandCursor: true });
    douglas.on('pointerdown', () => {
      feel(this, 'douglas_happy', 'soft');
      this.add.text(W - 120, H - 160, 'Douglas is happy!', { fontSize: '16px', color: '#FFD23F' }).setOrigin(0.5);
      this.time.delayedCall(700, () => this.scene.start('DouglasDenScene'));
    });

    this.add.text(W / 2, H - 45, 'Find Baby Bell! 🐱', {
      fontFamily: FONT,
      fontSize: '18px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  openDailyChest() {
    const today = new Date().toISOString().split('T')[0];
    if (S.dailyRewardLastClaimed === today) {
      feel(this, 'button_click', 'tap');
      this.add.text(this.scale.width / 2, 140, 'Come back tomorrow!', { fontSize: '18px', color: '#ff6666' }).setOrigin(0.5);
      return;
    }
    S.dailyRewardLastClaimed = today;
    S.stars = (S.stars || 0) + 25;
    if (typeof persist === 'function') persist();

    feel(this, 'chest_open', 'success');
    const popup = this.add.text(this.scale.width / 2, 200, '🎁 +25 Stars!', {
      fontFamily: FONT,
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.time.delayedCall(1200, () => {
      popup.destroy();
      this.scene.start('WorldMapScene');
    });
  }
}