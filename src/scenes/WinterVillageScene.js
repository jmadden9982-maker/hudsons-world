import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { S, addAchievement, addJournal, addSticker, addXp, persist, unlockNextCritter } from '../systems/state.js';
import { ambientMotes, premiumBackdrop, queuePremiumBackdrop, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { smoothDelta } from '../systems/gameplay.js';

export default class WinterVillageScene extends AdventureBase {
  constructor() { super('WinterVillageScene'); }

  preload() { queuePremiumBackdrop(this, 'premium-winter', 'assets/premium/winter-village.png'); }

  create() {
    this.snowScore = 0; this.caught = 0; this.combo = 0; this.bestCombo = 0; this.warmth = 3;
    this.targets = []; this.targetX = 360;
    premiumBackdrop(this, 'premium-winter', { shade: 0.06, drift: false, transient: true });
    ambientMotes(this, { count: 20, color: 0xdff6ff, depth: -1 });
    this.add.text(360, 155, '❄️  WINTER VILLAGE  ❄️', textStyle(25, '#ffffff', { fontStyle: 'bold', stroke: '#23466f', strokeThickness: 7 })).setOrigin(0.5);
    this.status = this.add.text(24, 108, '', textStyle(19, '#ffffff', { fontStyle: 'bold', backgroundColor: '#284c78', padding: { x: 13, y: 8 } })).setDepth(40);
    this.comboText = this.add.text(360, 208, '', textStyle(15, '#ffffff', { fontStyle: 'bold', backgroundColor: '#284c78', padding: { x: 11, y: 7 } })).setOrigin(0.5).setDepth(40);
    this.sledGlow = this.add.ellipse(360, 1040, 180, 74, 0xbbeaff, 0.32).setDepth(14);
    this.sled = this.add.text(360, 1005, '🛷', textStyle(88, '#ffffff', { stroke: '#dff6ff', strokeThickness: 3 })).setOrigin(0.5).setDepth(16);
    this.add.text(360, 1155, 'Slide the sleigh left and right to catch snow • Avoid cocoa!', textStyle(15, '#ffffff', { fontStyle: 'bold', stroke: '#23466f', strokeThickness: 5 })).setOrigin(0.5).setDepth(20);
    this.cursors = this.input.keyboard?.createCursorKeys();
    const steer = (pointer) => { if (this.started && !this.finished && pointer.y > 190) this.targetX = Phaser.Math.Clamp(pointer.x, 80, 640); };
    this.input.on('pointerdown', steer); this.input.on('pointermove', (pointer) => { if (pointer.isDown) steer(pointer); });
    this.updateStatus();
    this.begin('WINTER VILLAGE', 'Guide the sleigh across the snow. Catch falling snowflakes and rare ice crystals, but steer away from the hot cocoa. Build a combo without tapping anything!', '❄️🛷');
  }

  onAdventureStart() {
    this.spawnEvent = this.time.addEvent({ delay: S.settings.calm ? 850 : 580, loop: true, callback: () => this.spawn() });
    this.makeTimer(S.settings.calm ? 42 : 34, () => this.finish());
  }

  updateStatus() {
    this.status.setText(`❄️ ${this.snowScore}   ${'🔥'.repeat(this.warmth)}${'·'.repeat(3 - this.warmth)}`);
    this.comboText.setText(this.combo > 1 ? `SNOW COMBO ×${this.combo}` : 'SLEIGH READY');
  }

  spawn() {
    if (this.finished || !this.started) return;
    const roll = Math.random(); const type = roll < 0.68 ? 'flake' : roll < 0.82 ? 'crystal' : 'cocoa';
    const icon = { flake: '❄️', crystal: '💎', cocoa: '☕' }[type]; const size = { flake: 49, crystal: 42, cocoa: 46 }[type];
    const target = this.add.text(Phaser.Math.Between(55, 665), 180, icon, textStyle(size)).setOrigin(0.5).setDepth(10).setScale(0.4);
    target.setData({ type, speed: Phaser.Math.FloatBetween(S.settings.calm ? 0.17 : 0.22, S.settings.calm ? 0.24 : 0.31), phase: Phaser.Math.FloatBetween(0, Math.PI * 2), age: 0, caught: false });
    this.tweens.add({ targets: target, scale: 1, duration: 260, ease: 'Back.easeOut' }); this.targets.push(target);
  }

  catchTarget(target) {
    const type = target.getData('type'); target.setData('caught', true);
    if (type === 'cocoa') {
      this.warmth -= 1; this.combo = 0; AudioManager.playSfx('bump'); this.impact(0.006);
      this.floatingText(target.x, target.y, 'TOO TOASTY!', '#ffd28a');
    } else {
      const points = type === 'crystal' ? 3 : 1; this.snowScore += points; this.caught += 1; this.combo += 1; this.bestCombo = Math.max(this.bestCombo, this.combo);
      AudioManager.playSfx(type === 'crystal' ? 'reward' : 'success'); this.floatingText(target.x, target.y, type === 'crystal' ? '+3 ICE CRYSTAL' : '+1 SNOW', '#ffffff');
      this.celebrate(target.x, target.y, type === 'crystal' ? 0x8fe7ff : 0xdff6ff);
    }
    target.destroy(); this.updateStatus(); if (this.warmth <= 0) this.time.delayedCall(150, () => this.finish(true));
  }

  update(time, delta) {
    if (!this.started || this.finished) return;
    delta = smoothDelta(delta);
    if (this.cursors?.left.isDown) this.targetX -= delta * 0.42;
    if (this.cursors?.right.isDown) this.targetX += delta * 0.42;
    this.targetX = Phaser.Math.Clamp(this.targetX, 80, 640);
    const smoothing = Phaser.Math.Clamp(delta / (S.settings.calm ? 145 : 95), 0.06, 0.26);
    this.sled.x = Phaser.Math.Linear(this.sled.x, this.targetX, smoothing); this.sledGlow.x = this.sled.x;
    this.sled.setAngle(Phaser.Math.Clamp((this.targetX - this.sled.x) * 0.08, -10, 10));
    this.targets = this.targets.filter((target) => {
      if (!target.active) return false;
      const age = target.getData('age') + delta; target.setData('age', age);
      target.y += delta * target.getData('speed'); target.x += Math.sin(age * 0.0022 + target.getData('phase')) * delta * 0.045; target.angle += target.getData('type') === 'flake' ? delta * 0.025 : 0;
      if (!target.getData('caught') && target.y > 925 && target.y < 1065 && Math.abs(target.x - this.sled.x) < 88) this.catchTarget(target);
      if (!target.active) return false;
      if (target.y > 1125) { if (target.getData('type') !== 'cocoa') this.combo = 0; target.destroy(); this.updateStatus(); return false; }
      return true;
    });
  }

  finish(tooToasty = false) {
    if (this.finished) return; this.finished = true; this.spawnEvent?.remove(); this.timerEvent?.remove(); this.targets.forEach((target) => target.active && target.destroy());
    const stars = this.snowScore >= 30 ? 3 : this.snowScore >= 17 ? 2 : 1; const score = this.snowScore * 80 + this.bestCombo * 25 + this.warmth * 60;
    const critter = unlockNextCritter('Winter Village'); S.winterBest = Math.max(S.winterBest, score); S.stars += stars; addXp(30); addSticker('snow-day'); addAchievement('winter-wonder'); addJournal('winter-village', '❄️', 'Winter Village', `Hudson guided the sleigh to catch ${this.caught} winter treasures.`); persist();
    showAdventureResult(this, { title: tooToasty ? 'SLEIGH WARM-UP!' : 'WINTER WONDER!', message: `${this.snowScore} snow points with a best combo of ${this.bestCombo}.`, stars, score, scoreLabel: 'Sleigh score', rewardText: critter ? `New critter: ${critter.icon} ${critter.name}!` : 'Snow Day sticker added!', onReplay: () => this.scene.restart() });
  }
}
