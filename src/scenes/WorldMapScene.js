import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { sceneBg } from '../ui/kit.js';
import { grantReward } from '../systems/progression.js';
import { track } from '../systems/family.js';
import SaveSystem from '../systems/SaveSystem.js';

export default class WorldMapScene extends Phaser.Scene {
  constructor() { super('WorldMapScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_calm');

    const { width, height } = this.scale;

    if (this.textures.exists('bg_worldmap')) {
      sceneBg(this, 'bg_worldmap', 0x87CEEB, 0xBFE9FF);
    } else {
      this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0);
      this.add.rectangle(0, height * 0.7, width, height * 0.3, 0x228B22).setOrigin(0);
    }

    this.spawnClouds();

    this.add.text(width / 2, 55, 'Adventure Map', { fontSize: '36px', color: '#ffffff', fontStyle: 'bold' })
      .setOrigin(0.5).setShadow(0, 3, '#00000066', 4);

    const zones = [
      { name: 'Douglas Dash', emoji: '🐕', scene: 'DouglasDashScene', x: 200, y: 220, color: 0x228B22 },
      { name: 'Hudson House', emoji: '🏠', scene: 'HudsonHouseScene', x: 520, y: 220, color: 0x8B4513 },
      { name: 'Douglas Den', emoji: '🦴', scene: 'DouglasDenScene', x: 360, y: 380, color: 0xD2691E },
      { name: 'Journal', emoji: '📖', scene: 'AdventureJournalScene', x: 200, y: 540, color: 0x4B0082 },
      { name: 'Photo Wall', emoji: '📸', scene: 'FamilyPhotoWallScene', x: 520, y: 540, color: 0xFF6347 },
      { name: 'Trophy Room', emoji: '🏆', scene: 'TrophyRoomScene', x: 200, y: 700, color: 0xFFD700 },
      { name: 'Wardrobe', emoji: '👕', scene: 'WardrobeScene', x: 520, y: 700, color: 0x9370DB },
      { name: 'Family', emoji: '👨‍👩‍👧', scene: 'FamilyQuestScene', x: 200, y: 860, color: 0xE5728F },
      { name: 'Games', emoji: '🎮', scene: 'GamesHubScene', x: 520, y: 860, color: 0x3FA7D6 }
    ];

    zones.forEach(zone => {
      const card = this.add.rectangle(zone.x, zone.y, 240, 100, zone.color).setStrokeStyle(3, 0xffffff, 0.7).setInteractive({ useHandCursor: true });
      const label = this.add.text(zone.x, zone.y - 15, zone.emoji + ' ' + zone.name, { fontSize: '20px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setShadow(0, 2, '#00000077', 2);

      // Gentle bob on the label for a little life.
      this.tweens.add({ targets: label, y: label.y - 4, duration: Phaser.Math.Between(1100, 1600), yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

      // Twinkling sparkle on the corner of each unlocked zone.
      const sp = this.add.text(zone.x + 96, zone.y - 34, '✨', { fontSize: '20px' }).setOrigin(0.5);
      this.tweens.add({ targets: sp, alpha: { from: 0.25, to: 1 }, scale: { from: 0.7, to: 1.15 }, duration: Phaser.Math.Between(700, 1100), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 600), ease: 'Sine.easeInOut' });

      card.on('pointerdown', () => {
        AudioManager.playSfx('button_click');
        this.tweens.add({ targets: [card, label], scaleX: 0.92, scaleY: 0.92, duration: 90, yoyo: true, ease: 'Quad.easeOut', onComplete: () => this.scene.start(zone.scene) });
      });
    });

    this.applyDayNightWash();
    this.maybeSpawnBabybell();
  }

  spawnClouds() {
    const { width } = this.scale;
    const make = (y, scale, dur, delay) => {
      const g = this.add.graphics().setDepth(-70);
      g.fillStyle(0xffffff, 0.9);
      g.fillEllipse(0, 0, 96, 54); g.fillEllipse(42, 10, 74, 44); g.fillEllipse(-42, 10, 74, 44);
      g.x = -160; g.y = y; g.setScale(scale);
      this.tweens.add({ targets: g, x: width + 170, duration: dur, repeat: -1, delay });
      return g;
    };
    make(120, 0.9, 16000, 0);
    make(200, 0.6, 21000, 4000);
    make(95, 0.7, 19000, 9000);
    make(250, 1.0, 24000, 14000);
  }

  applyDayNightWash() {
    const { width: W, height: H } = this.scale;
    const hr = new Date().getHours();
    let color = 0x000000, alpha = 0;
    if (hr < 6) { color = 0x0A1A3A; alpha = 0.42; }        // night
    else if (hr < 9) { color = 0xFFD9A0; alpha = 0.16; }   // dawn
    else if (hr < 17) { alpha = 0; }                        // day (clear)
    else if (hr < 20) { color = 0xFF9A4D; alpha = 0.20; }   // dusk
    else { color = 0x0A1A3A; alpha = 0.38; }               // night
    // Non-interactive overlay above the cards — taps pass straight through to the zones.
    if (alpha > 0) this.add.rectangle(0, 0, W, H, color, alpha).setOrigin(0).setDepth(50);
  }

  // Babybell occasionally hides on the map; finding her is a small, save-safe reward.
  maybeSpawnBabybell() {
    if (Math.random() > 0.5) return;
    const { width: W, height: H } = this.scale;
    const x = Phaser.Math.Between(80, W - 80);
    const y = Phaser.Math.Between(1000, 1140);
    const bell = this.add.text(x, y, '🐱', { fontSize: '46px' }).setOrigin(0.5).setAlpha(0).setDepth(60).setInteractive({ useHandCursor: true });
    this.time.delayedCall(Phaser.Math.Between(1200, 3000), () => {
      if (!bell.active) return;
      this.tweens.add({ targets: bell, alpha: 1, duration: 500 });
      this.tweens.add({ targets: bell, y: y - 8, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
    bell.on('pointerdown', () => {
      if (!bell.active) return;
      AudioManager.playSfx('golden_shimmer');
      try { SaveSystem.incrementBabyBellCount(); } catch (e) {}
      track('star', 1); // counts as a sparkly find for Babybell's family quest
      grantReward(this, 20, 10, 'You found Babybell! 🐱');
      const burst = this.add.text(bell.x, bell.y, '✨', { fontSize: '44px' }).setOrigin(0.5).setDepth(61);
      this.tweens.add({ targets: burst, alpha: 0, scale: 1.8, duration: 600, onComplete: () => burst.destroy() });
      bell.destroy();
    });
  }
}
