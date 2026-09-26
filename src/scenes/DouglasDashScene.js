import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { S, recordAdventure } from '../systems/state.js';
import { ambientMotes, button, COLORS, premiumBackdrop, queuePremiumBackdrop, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { DOUGLAS_SKINS } from '../data/collections.js';
import { smoothDelta } from '../systems/gameplay.js';
import { createActor } from '../systems/CharacterActor.js';

export default class DouglasDashScene extends AdventureBase {
  constructor() { super('DouglasDashScene'); }
  preload() { queuePremiumBackdrop(this, 'premium-forest', 'assets/premium/forest-run.png'); }
  create() {
    const { width: W, height: H } = this.scale;
    this.lanes = [190, 360, 530]; this.lane = 1; this.distance = 0; this.bones = 0; this.streak = 0; this.bestStreak = 0; this.hearts = 3; this.objects = []; this.invulnerable = false; this.jumping = false;
    premiumBackdrop(this, 'premium-forest', { shade: 0.08, drift: false, transient: true }); ambientMotes(this, { count: 16, color: 0xffe793, depth: -1 });
    [275, 445].forEach((x) => this.add.rectangle(x, 720, 4, 860, 0xfff0bd, 0.22).setDepth(-1));
    this.hudText = this.add.text(28, 108, '🏃 0m   🦴 0   ❤️❤️❤️', textStyle(21, '#ffffff', { fontStyle: 'bold', backgroundColor: '#211b3c', padding: { x: 12, y: 8 } })).setDepth(40);
    this.playerShadow = this.add.ellipse(this.lanes[this.lane], 1015, 110, 32, 0x090612, 0.38);
    const douglasLook = DOUGLAS_SKINS.find((skin) => skin.id === S.douglas.skin) || DOUGLAS_SKINS[0];
    this.playerActor = createActor(this, 'douglas', this.lanes[this.lane], 965, { icon: douglasLook.icon, size: 72, depth: 15 });
    this.player = this.playerActor.object;
    this.add.text(W / 2, 1165, 'Swipe or use the big buttons', textStyle(16, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(20);
    button(this, 120, 1100, '‹', () => this.changeLane(-1), { width: 150, height: 82, color: 0x6c4ccf, fontSize: 44, depth: 25 });
    button(this, 360, 1100, '↑ JUMP', () => this.jump(), { width: 200, height: 82, color: 0x47a8e8, fontSize: 23, depth: 25 });
    button(this, 600, 1100, '›', () => this.changeLane(1), { width: 150, height: 82, color: 0x6c4ccf, fontSize: 44, depth: 25 });
    this.input.keyboard?.on('keydown-LEFT', () => this.changeLane(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.changeLane(1));
    this.input.keyboard?.on('keydown-UP', () => this.jump());
    let startX = 0; let startY = 0;
    this.input.on('pointerdown', (p) => { startX = p.x; startY = p.y; });
    this.input.on('pointerup', (p) => {
      const dx = p.x - startX; const dy = p.y - startY;
      if (Math.abs(dy) > 55 && dy < 0) this.jump(); else if (Math.abs(dx) > 50) this.changeLane(dx > 0 ? 1 : -1);
    });
    this.begin('DOUGLAS DASH', 'Race down the three-lane temple trail. Swipe left or right to dodge logs. Swipe up to jump. Collect bones for Douglas!', '🐶');
  }
  onAdventureStart() {
    this.lastTime = this.time.now;
    this.spawnObstacleEvent = this.time.addEvent({ delay: S.settings.calm ? 1350 : 1000, loop: true, callback: () => this.spawn('obstacle') });
    this.spawnBoneEvent = this.time.addEvent({ delay: Math.max(520, 720 - (S.douglas.level - 1) * 45), loop: true, callback: () => this.spawn('bone') });
    this.makeTimer(S.settings.calm ? 42 : 36, () => this.finish());
  }
  changeLane(direction) {
    if (!this.started || this.finished) return;
    this.lane = Phaser.Math.Clamp(this.lane + direction, 0, 2);
    this.playerActor.setFacing(direction);
    this.tweens.add({ targets: [this.player, this.playerShadow], x: this.lanes[this.lane], duration: S.settings.calm ? 180 : 120, ease: 'Sine.easeOut' });
  }
  jump() {
    if (!this.started || this.finished || this.jumping) return;
    this.jumping = true; AudioManager.playSfx('button_confirm');
    this.playerActor.playState('jump');
    this.tweens.add({ targets: this.player, y: 820, duration: 300, yoyo: true, ease: 'Sine.easeOut', onComplete: () => { this.jumping = false; this.playerActor.playState('idle'); } });
    this.tweens.add({ targets: this.playerShadow, scaleX: 0.55, alpha: 0.1, duration: 300, yoyo: true });
  }
  spawn(type) {
    if (!this.started || this.finished) return;
    const lane = Phaser.Math.Between(0, 2); const icon = type === 'bone' ? '🦴' : Phaser.Utils.Array.GetRandom(['🪵', '🪨']);
    const object = this.add.text(this.lanes[lane], 170, icon, textStyle(type === 'bone' ? 43 : 58)).setOrigin(0.5).setDepth(10);
    object.setData({ lane, type, hit: false }); this.objects.push(object);
  }
  update(time, delta) {
    if (!this.started || this.finished) return;
    delta = smoothDelta(delta);
    const speed = (S.settings.calm ? 0.27 : 0.34) + Math.min(S.settings.calm ? 0.05 : 0.11, this.distance / 9000); this.distance += delta * 0.033;
    this.objects = this.objects.filter((object) => {
      if (!object.active) return false;
      object.y += delta * speed; object.setScale(0.7 + object.y / 1800);
      if (!object.getData('hit') && object.y > 875 && object.y < 1035 && object.getData('lane') === this.lane) {
        object.setData('hit', true);
        if (object.getData('type') === 'bone') {
          this.bones += 1; this.streak += 1; this.bestStreak = Math.max(this.bestStreak, this.streak); AudioManager.playSfx('bone_collect'); this.floatingText(object.x, object.y, this.streak > 1 ? `BONE STREAK ×${this.streak}` : '+1 BONE', COLORS.yellow); this.celebrate(object.x, object.y, 0xffd447); object.destroy();
        } else if (!this.jumping && !this.invulnerable) {
          this.hearts -= 1; this.streak = 0; this.invulnerable = true; AudioManager.playSfx('bump'); this.floatingText(object.x, object.y, 'BOUNCE!', '#ffdf7a'); this.impact(); object.destroy();
          this.playerActor.playState('hurt'); this.time.delayedCall(900, () => { this.invulnerable = false; });
          if (this.hearts <= 0) { this.finish(true); return false; }
        }
      }
      if (object.y > 1200) { object.destroy(); return false; }
      return true;
    });
    this.hudText.setText(`🏃 ${Math.round(this.distance)}m   🦴 ${this.bones} ×${this.streak}   ${'❤️'.repeat(this.hearts)}${'🤍'.repeat(3 - this.hearts)}`);
  }
  finish(neededBreather = false) {
    if (this.finished) return; this.finished = true; this.spawnObstacleEvent?.remove(); this.spawnBoneEvent?.remove(); this.timerEvent?.remove();
    if (!neededBreather) this.playerActor.playState('celebrate');
    const score = Math.round(this.distance + this.bones * 35 + this.bestStreak * 20); const stars = score >= 1100 ? 3 : score >= 700 ? 2 : 1;
    const result = recordAdventure('forest', score, stars, { bones: this.bones, icon: '🐶', title: 'Douglas Dash Champion', journal: `Hudson helped Douglas race ${Math.round(this.distance)} metres and collect ${this.bones} bones.` });
    const rewardText = result.critter ? `New critter: ${result.critter.icon} ${result.critter.name}!` : result.firstBadge ? 'New Forest Badge + Ranger Outfit!' : result.newStars ? `You improved by ${result.newStars} star!` : 'Great practice run!';
    showAdventureResult(this, { title: neededBreather ? 'Douglas Took a Breather!' : 'TEMPLE TRAIL COMPLETE!', message: neededBreather ? 'Even champions stop for a drink. Every run still counts!' : 'Fast paws and brilliant steering!', stars, score, rewardText, onReplay: () => this.scene.restart() });
  }
}
