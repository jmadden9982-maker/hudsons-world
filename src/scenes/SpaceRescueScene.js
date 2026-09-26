import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { S, recordAdventure } from '../systems/state.js';
import { ambientMotes, premiumBackdrop, queuePremiumBackdrop, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { pickSpaceSpawnType, smoothDelta, withinRadius } from '../systems/gameplay.js';

export default class SpaceRescueScene extends AdventureBase {
  constructor() { super('SpaceRescueScene'); }

  preload() { queuePremiumBackdrop(this, 'premium-space', 'assets/premium/space-rescue.png'); }

  create() {
    this.rescued = 0; this.stardust = 0; this.combo = 0; this.bestCombo = 0;
    this.shields = S.douglas.level >= 4 ? 4 : 3; this.maxShields = this.shields;
    this.objects = []; this.invulnerable = false; this.targetX = 360; this.targetY = 950;
    premiumBackdrop(this, 'premium-space', { shade: 0.03, drift: false, transient: true });
    ambientMotes(this, { count: 24, color: 0xa8d8ff, depth: -1 });

    this.status = this.add.text(24, 108, '', textStyle(19, '#ffffff', { fontStyle: 'bold', backgroundColor: '#211b3c', padding: { x: 13, y: 8 } })).setDepth(40);
    this.comboText = this.add.text(360, 158, '', textStyle(16, '#ffd447', { fontStyle: 'bold', backgroundColor: '#211b3c', padding: { x: 12, y: 7 } })).setOrigin(0.5).setDepth(40);
    this.shipShadow = this.add.ellipse(this.targetX, this.targetY + 42, 82, 28, 0x1e0e4e, 0.38).setDepth(13);
    this.ship = this.add.text(this.targetX, this.targetY, '🚀', textStyle(82, '#ffffff', { stroke: '#bfe8ff', strokeThickness: 3 })).setOrigin(0.5).setDepth(15).setAngle(-45);
    this.add.text(360, 1160, 'Drag anywhere to pilot • Rescue explorers • Dodge asteroids', textStyle(15, '#ffffff', { fontStyle: 'bold', stroke: '#171126', strokeThickness: 5 })).setOrigin(0.5).setDepth(20);

    this.cursors = this.input.keyboard?.createCursorKeys();
    const steer = (pointer) => {
      if (!this.started || this.finished || pointer.y < 165 || pointer.y > 1120) return;
      this.targetX = Phaser.Math.Clamp(pointer.x, 65, 655);
      this.targetY = Phaser.Math.Clamp(pointer.y, 300, 1030);
    };
    this.input.on('pointerdown', steer); this.input.on('pointermove', (pointer) => { if (pointer.isDown) steer(pointer); });
    this.updateStatus();
    this.begin('SPACE RESCUE', 'Pilot the rocket freely around the whole sky. Drag to rescue floating astronauts, collect glowing stardust and dodge tumbling asteroids. This is a free-flight mission!', '🚀');
  }

  onAdventureStart() {
    this.spawnEvent = this.time.addEvent({ delay: S.settings.calm ? 900 : 650, loop: true, callback: () => this.spawn() });
    this.trailEvent = this.time.addEvent({ delay: 85, loop: true, callback: () => this.makeTrail() });
    this.makeTimer(S.settings.calm ? 44 : 36, () => this.finish());
  }

  updateStatus() {
    this.status.setText(`🧑‍🚀 ${this.rescued}   ✨ ${this.stardust}   ${'🛡️'.repeat(this.shields)}${'·'.repeat(this.maxShields - this.shields)}`);
    this.comboText.setText(this.combo > 1 ? `COMBO ×${this.combo}` : 'FREE FLIGHT');
  }

  spawn() {
    if (this.finished || !this.started) return;
    const type = pickSpaceSpawnType(Math.random());
    const icon = { astronaut: '🧑‍🚀', stardust: '✨', shield: '🛡️', asteroid: '☄️' }[type];
    const size = { astronaut: 47, stardust: 42, shield: 46, asteroid: 61 }[type];
    const object = this.add.text(Phaser.Math.Between(60, 660), 155, icon, textStyle(size)).setOrigin(0.5).setDepth(10);
    object.setData({ type, speed: Phaser.Math.FloatBetween(S.settings.calm ? 0.18 : 0.23, S.settings.calm ? 0.25 : 0.34), phase: Phaser.Math.FloatBetween(0, Math.PI * 2), age: 0 });
    object.setScale(0.35); this.tweens.add({ targets: object, scale: 1, duration: 300, ease: 'Back.easeOut' });
    this.objects.push(object);
  }

  makeTrail() {
    if (!this.started || this.finished || S.settings.calm) return;
    const trail = this.add.circle(this.ship.x, this.ship.y + 45, Phaser.Math.Between(4, 9), Phaser.Utils.Array.GetRandom([0x75d9ff, 0xd28cff, 0xffd447]), 0.75).setDepth(12);
    this.tweens.add({ targets: trail, y: trail.y + 45, scale: 0.1, alpha: 0, duration: 430, onComplete: () => trail.destroy() });
  }

  spacePuff(x, y, color) {
    if (S.settings.calm) return;
    for (let i = 0; i < 8; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); const distance = Phaser.Math.Between(24, 58);
      const spark = this.add.circle(x, y, Phaser.Math.Between(3, 6), color, 0.85).setDepth(9);
      this.tweens.add({ targets: spark, x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance, alpha: 0, scale: 0.2, duration: 360, ease: 'Quad.easeOut', onComplete: () => spark.destroy() });
    }
  }

  collect(object) {
    const type = object.getData('type');
    if (type === 'astronaut') {
      this.rescued += 1; this.combo += 1; AudioManager.playSfx('success');
      this.floatingText(object.x, object.y, 'RESCUED!', '#ffd447'); this.celebrate(object.x, object.y, 0x8fdcff); this.spacePuff(object.x, object.y, 0x8fdcff); this.milestoneBurst(object.x, object.y, this.combo, 0x8fdcff);
    } else if (type === 'stardust') {
      this.stardust += 1; this.combo += 1; AudioManager.playSfx('bone_collect');
      this.floatingText(object.x, object.y, 'STARDUST!', '#e3a8ff'); this.celebrate(object.x, object.y, 0xd28cff); this.spacePuff(object.x, object.y, 0xd28cff); this.milestoneBurst(object.x, object.y, this.combo, 0xd28cff);
    } else if (type === 'shield') {
      AudioManager.playSfx('success');
      if (this.shields < this.maxShields) { this.shields += 1; this.floatingText(object.x, object.y, 'SHIELD RESTORED!', '#8fdcff'); }
      else { this.combo += 1; this.floatingText(object.x, object.y, 'FULL SHIELDS — BONUS!', '#8fdcff'); }
      this.celebrate(object.x, object.y, 0x8fdcff); this.spacePuff(object.x, object.y, 0x8fdcff);
    } else if (!this.invulnerable) {
      this.shields -= 1; this.combo = 0; this.invulnerable = true; AudioManager.playSfx('bump'); this.impact(0.008);
      this.ship.setAlpha(0.38); this.time.delayedCall(900, () => { this.invulnerable = false; if (this.ship.active) this.ship.setAlpha(1); });
      if (this.shields <= 0) this.time.delayedCall(120, () => this.finish(true));
    }
    this.bestCombo = Math.max(this.bestCombo, this.combo); this.updateStatus(); object.destroy();
  }

  update(time, delta) {
    if (!this.started || this.finished) return;
    delta = smoothDelta(delta);
    const keyboardSpeed = delta * 0.34;
    if (this.cursors?.left.isDown) this.targetX -= keyboardSpeed;
    if (this.cursors?.right.isDown) this.targetX += keyboardSpeed;
    if (this.cursors?.up.isDown) this.targetY -= keyboardSpeed;
    if (this.cursors?.down.isDown) this.targetY += keyboardSpeed;
    this.targetX = Phaser.Math.Clamp(this.targetX, 65, 655); this.targetY = Phaser.Math.Clamp(this.targetY, 300, 1030);
    const smoothing = Phaser.Math.Clamp(delta / (S.settings.calm ? 155 : 105), 0.06, 0.24);
    const oldX = this.ship.x; this.ship.x = Phaser.Math.Linear(this.ship.x, this.targetX, smoothing); this.ship.y = Phaser.Math.Linear(this.ship.y, this.targetY, smoothing);
    this.ship.setAngle(-45 + Phaser.Math.Clamp((this.ship.x - oldX) * 1.8, -18, 18));
    this.shipShadow.setPosition(this.ship.x, this.ship.y + 42).setScale(0.8 + (1030 - this.ship.y) / 1800);

    this.objects = this.objects.filter((object) => {
      if (!object.active) return false;
      const age = object.getData('age') + delta; object.setData('age', age);
      object.y += delta * object.getData('speed');
      object.x += Math.sin(age * 0.002 + object.getData('phase')) * delta * 0.035;
      object.rotation += object.getData('type') === 'asteroid' ? delta * 0.0014 : delta * 0.00035;
      if (withinRadius(object.x, object.y, this.ship.x, this.ship.y, object.getData('type') === 'asteroid' ? 66 : 58)) this.collect(object);
      if (!object.active) return false;
      if (object.y > 1160) { if (object.getData('type') === 'astronaut') this.combo = 0; object.destroy(); this.updateStatus(); return false; }
      return true;
    });
  }

  finish(shieldsDown = false) {
    if (this.finished) return; this.finished = true; this.spawnEvent?.remove(); this.trailEvent?.remove(); this.timerEvent?.remove();
    this.objects.forEach((object) => object.active && object.destroy());
    const score = this.rescued * 180 + this.stardust * 55 + this.bestCombo * 30 + this.shields * 80;
    const stars = score >= 2100 ? 3 : score >= 1150 ? 2 : 1;
    const result = recordAdventure('space', score, stars, { icon: '🚀', title: 'Space Station Rescue', journal: `Commander Hudson free-flew through the stars and brought ${this.rescued} explorers safely home.` });
    const rewardText = result.critter ? `New critter: ${result.critter.icon} ${result.critter.name}!` : result.firstBadge ? 'New Space Badge + Astronaut Outfit!' : `Best rescue combo: ${this.bestCombo}`;
    showAdventureResult(this, { title: shieldsDown ? 'ROCKET SAFELY LANDED!' : 'DEEP-SPACE MISSION COMPLETE!', message: `${this.rescued} explorers rescued and ${this.stardust} stardust collected.`, stars, score, scoreLabel: 'Mission score', rewardText, onReplay: () => this.scene.restart() });
  }
}
