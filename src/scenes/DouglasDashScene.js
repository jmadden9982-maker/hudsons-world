import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';
import { sceneBg, makeDouglasSprite, gameButton, COL, FONT, gotoScene, installSceneLifecycle } from '../ui/kit.js';
import { onDashStart, onDashEnd } from '../systems/progression.js';
import { track } from '../systems/family.js';

// World themes reuse backgrounds already committed in public/assets/bg/.
const WORLDS = [
  { name: 'Park Run',     bg: 'bg_dash',    sky: 0x87CEEB, ground: 0x3FA535 },
  { name: 'Pirate Cove',  bg: 'bg_pirate',  sky: 0x2E6E8E, ground: 0xC2A36B },
  { name: 'Dino Valley',  bg: 'bg_dino',    sky: 0x7FB069, ground: 0x6B8E23 },
  { name: 'Space Station',bg: 'bg_space',   sky: 0x1B1340, ground: 0x3A2E66 },
  { name: 'Pumpkin Patch',bg: 'bg_pumpkin', sky: 0xE9762B, ground: 0x7A4A1E },
  { name: 'Kingdom Run',  bg: 'bg_kingdom', sky: 0x6FA8DC, ground: 0x9B7B3F }
];

export default class DouglasDashScene extends Phaser.Scene {
  constructor() { super('DouglasDashScene'); }

  // Optional { world } from the World Map lets a themed location start at its theme.
  init(data) {
    const n = data && Number.isInteger(data.world) ? data.world : 0;
    this.startWorld = Math.max(0, Math.min(WORLDS.length - 1, n));
  }

  create() {
    AudioManager.setScene(this);
    installSceneLifecycle(this, 'DouglasDashScene');
    const { width: W, height: H } = this.scale;

    this.score = 0;
    this.elapsed = 0;
    this.isGameOver = false;
    this.jumping = false;
    this.sliding = false;
    this.entities = [];
    this.worldIndex = this.startWorld || 0;

    onDashStart(this); // first-play journal + photo
    track('dash_play'); // family quest progress

    // Three lanes across the width; player runs at a fixed line near the bottom.
    this.lanes = [W * 0.22, W * 0.5, W * 0.78];
    this.lane = 1;
    this.playerBaseY = H - 300;

    // Background + ground (themed per world).
    this.groundRect = this.add.rectangle(0, H - 90, W, 90, WORLDS[this.worldIndex].ground).setOrigin(0).setDepth(-90);
    this.setWorld(this.worldIndex);

    // Faint lane dividers so the three lanes read clearly.
    const div = this.add.graphics().setDepth(-80);
    div.lineStyle(4, 0xffffff, 0.18);
    div.lineBetween(W * 0.36, 80, W * 0.36, H - 90);
    div.lineBetween(W * 0.64, 80, W * 0.64, H - 90);

    // Player (Douglas sprite if available, else a friendly rectangle).
    this.player = makeDouglasSprite(this, this.lanes[1], this.playerBaseY, 'douglas_run');
    if (this.player) this.player.setScale(0.5);
    else this.player = this.add.rectangle(this.lanes[1], this.playerBaseY, 54, 70, 0x8B4513);
    this.player.setDepth(10);
    this.playerBaseScaleY = this.player.scaleY;

    // HUD: score + best + current world.
    this.scoreText = this.add.text(24, 26, 'Score: 0', { fontFamily: FONT, fontSize: '30px', color: '#ffffff', fontStyle: 'bold' })
      .setStroke('#1b1430', 6).setShadow(0, 2, '#000000', 4).setDepth(50);
    this.bestText = this.add.text(24, 62, 'Best: ' + SaveSystem.getHighScore(), { fontFamily: FONT, fontSize: '18px', color: '#FFD23F', fontStyle: 'bold' })
      .setStroke('#1b1430', 5).setShadow(0, 2, '#000000', 4).setDepth(50);
    this.worldText = this.add.text(W / 2, 30, WORLDS[0].name, { fontFamily: FONT, fontSize: '20px', color: '#ffffff', fontStyle: 'bold' })
      .setOrigin(0.5, 0).setStroke('#1b1430', 5).setShadow(0, 2, '#000000', 4).setDepth(50);

    // Controls hint (fades out).
    const hint = this.add.text(W / 2, H - 150, 'Swipe ⬅ ➡ to move\n⬆ jump   ⬇ slide', {
      fontFamily: FONT, fontSize: '20px', color: '#ffffff', fontStyle: 'bold', align: 'center'
    }).setOrigin(0.5).setStroke('#1b1430', 5).setDepth(50);
    this.tweens.add({ targets: hint, alpha: 0, delay: 2600, duration: 700, onComplete: () => hint.destroy() });

    this.setupInput();

    // Back button (top-right, clear of play).
    gameButton(this, W - 86, 44, 132, 52, '⬅ Back', COL.wood, () => gotoScene(this, 'WorldMapScene')).setDepth(130);

    this.spawnTimer = this.time.addEvent({ delay: 950, callback: this.spawnRow, callbackScope: this, loop: true });
  }

  setWorld(i) {
    const { width: W, height: H } = this.scale;
    const w = WORLDS[i];
    this.worldIndex = i;
    if (this.worldBg) this.worldBg.destroy();
    if (this.textures.exists(w.bg)) this.worldBg = sceneBg(this, w.bg, w.sky, w.sky);
    else this.worldBg = this.add.rectangle(0, 0, W, H, w.sky).setOrigin(0).setDepth(-100);
    if (this.groundRect) this.groundRect.setFillStyle(w.ground);
    if (this.worldText) {
      this.worldText.setText(w.name);
      const banner = this.add.text(W / 2, H / 2, w.name + '!', { fontFamily: FONT, fontSize: '44px', color: '#FFD23F', fontStyle: 'bold' })
        .setOrigin(0.5).setStroke('#1b1430', 7).setDepth(60);
      this.tweens.add({ targets: banner, alpha: 0, scale: 1.3, delay: 600, duration: 700, onComplete: () => banner.destroy() });
    }
  }

  setupInput() {
    this.input.on('pointerdown', (p) => { this._sx = p.x; this._sy = p.y; });
    this.input.on('pointerup', (p) => {
      if (this.isGameOver) return;
      const dx = p.x - (this._sx ?? p.x), dy = p.y - (this._sy ?? p.y);
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) this.changeLane(dx > 0 ? 1 : -1);
      else if (dy < -30) this.jump();
      else if (dy > 30) this.slide();
      else this.jump(); // a simple tap = jump
    });
    const kb = this.input.keyboard;
    if (kb) {
      kb.on('keydown-LEFT', () => this.changeLane(-1));
      kb.on('keydown-RIGHT', () => this.changeLane(1));
      kb.on('keydown-UP', () => this.jump());
      kb.on('keydown-DOWN', () => this.slide());
    }
  }

  changeLane(dir) {
    if (this.isGameOver) return;
    const n = Phaser.Math.Clamp(this.lane + dir, 0, 2);
    if (n === this.lane) return;
    this.lane = n;
    AudioManager.playSfx('button_click');
    this.tweens.add({ targets: this.player, x: this.lanes[n], duration: 110, ease: 'Quad.easeOut' });
  }

  jump() {
    if (this.isGameOver || this.jumping || this.sliding) return;
    this.jumping = true;
    AudioManager.playSfx('button_confirm');
    this.tweens.add({
      targets: this.player, y: this.playerBaseY - 170, duration: 300, yoyo: true, ease: 'Quad.easeOut',
      onComplete: () => { this.jumping = false; this.player.y = this.playerBaseY; }
    });
  }

  slide() {
    if (this.isGameOver || this.jumping || this.sliding) return;
    this.sliding = true;
    this.tweens.add({
      targets: this.player, scaleY: this.playerBaseScaleY * 0.5, duration: 120, yoyo: true, hold: 360, ease: 'Quad.easeOut',
      onComplete: () => { this.sliding = false; this.player.scaleY = this.playerBaseScaleY; }
    });
  }

  spawnRow() {
    if (this.isGameOver) return;
    const lane = Phaser.Math.Between(0, 2);
    this.spawnObstacle(lane, Math.random() < 0.5 ? 'jump' : 'duck');
    if (Math.random() < 0.8) {
      let bl = Phaser.Math.Between(0, 2);
      if (bl === lane) bl = (bl + 1) % 3;
      this.spawnCollectible(bl, Math.random() < 0.15 ? 'star' : 'bone');
    }
  }

  spawnObstacle(lane, type) {
    const x = this.lanes[lane];
    const c = this.add.container(x, -50).setDepth(6);
    if (type === 'jump') {
      const r = this.add.rectangle(0, 0, 76, 48, 0xC0392B).setStrokeStyle(3, 0xffffff);
      c.add([r, this.add.text(0, 0, '⬆️', { fontSize: '30px' }).setOrigin(0.5)]);
    } else {
      const r = this.add.rectangle(0, 0, 92, 38, 0x2E86C1).setStrokeStyle(3, 0xffffff);
      c.add([r, this.add.text(0, 0, '⬇️', { fontSize: '28px' }).setOrigin(0.5)]);
    }
    this.entities.push({ obj: c, lane, type, y: -50, done: false });
  }

  spawnCollectible(lane, kind) {
    const x = this.lanes[lane];
    const t = this.add.text(x, -40, kind === 'star' ? '⭐' : '🦴', { fontSize: kind === 'star' ? '40px' : '34px' }).setOrigin(0.5).setDepth(6);
    this.entities.push({ obj: t, lane, type: kind, y: -40, done: false, points: kind === 'star' ? 50 : 10 });
  }

  hit() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    if (this.spawnTimer) this.spawnTimer.remove();
    AudioManager.playSfx('error');
    this.cameras.main.shake(250, 0.012);
    const best = SaveSystem.setHighScore(this.score);
    this.bestText.setText('Best: ' + best);
    onDashEnd(this, this.score);
    this.time.delayedCall(900, () => gotoScene(this, 'GameOverScene', { score: this.score }));
  }

  update(time, delta) {
    if (this.isGameOver) return;
    const { height: H } = this.scale;
    const dt = delta / 1000;
    this.elapsed += dt;

    // Speed ramps up over the run; world advances every 150 points.
    const speed = 330 + Math.min(420, this.elapsed * 16);
    this.score += speed * dt * 0.02;
    this.scoreText.setText('Score: ' + Math.floor(this.score));
    const targetWorld = Math.min(WORLDS.length - 1, (this.startWorld || 0) + Math.floor(this.score / 150));
    if (targetWorld !== this.worldIndex) this.setWorld(targetWorld);

    const py = this.playerBaseY;
    const keep = [];
    for (const e of this.entities) {
      e.y += speed * dt;
      e.obj.y = e.y;
      if (!e.done && e.y > py - 38 && e.y < py + 50) {
        if (e.type === 'bone' || e.type === 'star') {
          if (e.lane === this.lane) {
            this.score += e.points;
            SaveSystem.addStars(e.points);
            AudioManager.playSfx(e.type === 'star' ? 'reward' : 'bone_collect');
            track(e.type === 'star' ? 'star' : 'bones', 1);
            e.done = true; e.obj.destroy();
            continue;
          }
        } else if (e.lane === this.lane) {
          const avoided = (e.type === 'jump' && this.jumping) || (e.type === 'duck' && this.sliding);
          if (!avoided) { e.done = true; this.hit(); return; }
          e.done = true;
        }
      }
      if (e.y > H + 70) { e.obj.destroy(); continue; }
      keep.push(e);
    }
    this.entities = keep;
  }
}
