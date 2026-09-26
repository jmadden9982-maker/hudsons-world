import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { S, recordAdventure } from '../systems/state.js';
import { ambientMotes, premiumBackdrop, queuePremiumBackdrop, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { isMilestone } from '../systems/gameplay.js';

const FRENZY_DURATION = 3000;

export default class PumpkinSmashScene extends AdventureBase {
  constructor() { super('PumpkinSmashScene'); }
  preload() { queuePremiumBackdrop(this, 'premium-pumpkin', 'assets/premium/pumpkin-patch.png'); }
  create() {
    const { width: W, height: H } = this.scale; this.smashed = 0; this.points = 0; this.combo = 0; this.bestCombo = 0; this.activeTargets = [];
    premiumBackdrop(this, 'premium-pumpkin', { shade: 0.08, drift: false, transient: true }); ambientMotes(this, { count: 18, color: 0xffc35c, depth: -1 });
    this.status = this.add.text(28, 108, '🎃 0   COMBO ×0', textStyle(20, '#ffffff', { fontStyle: 'bold', backgroundColor: '#5d3a23', padding: { x: 14, y: 8 } })).setDepth(40);
    this.add.text(W / 2, H - 80, 'Tap pumpkins • Gold pumpkins score ×3 • Protect the family!', textStyle(16, '#ffffff', { fontStyle: 'bold', stroke: '#5d3a23', strokeThickness: 5 })).setOrigin(0.5);
    this.begin('PUMPKIN PATCH', 'Tap pumpkins as they pop up. Golden pumpkins are worth three points. Leave Finley’s hat and Baby Bell safely alone to keep your harvest combo! Every 8-combo triggers a Harvest Frenzy — double points for a few seconds!', '🎃');
  }
  onAdventureStart() {
    this.spawnEvent = this.time.addEvent({ delay: S.settings.calm ? 850 : 600, loop: true, callback: () => this.spawn() });
    this.makeTimer(S.settings.calm ? 38 : 30, () => this.finish());
  }
  spawn() {
    if (this.finished) return; const roll = Math.random(); const type = roll < 0.12 ? 'gold' : roll < 0.78 ? 'pumpkin' : 'friend'; const x = Phaser.Math.Between(85, 635); const y = Phaser.Math.Between(260, 1000);
    const icon = type === 'gold' ? '🌟' : type === 'pumpkin' ? '🎃' : Phaser.Utils.Array.GetRandom(['🧢', '🐱']);
    const target = this.add.text(x, y, icon, textStyle(type === 'friend' ? 54 : 62, '#ffffff', type === 'gold' ? { stroke: '#ffd447', strokeThickness: 5 } : {})).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScale(0);
    target.setData('type', type); this.activeTargets.push(target); this.tweens.add({ targets: target, scale: 1, angle: { from: -12, to: 0 }, duration: 150, ease: 'Back.easeOut' });
    target.on('pointerdown', () => {
      if (!target.active || this.finished) return;
      if (type !== 'friend') {
        const frenzy = this.time.now < (this.frenzyUntil || 0); const value = (type === 'gold' ? 3 : 1) * (frenzy ? 2 : 1);
        this.smashed += 1; this.points += value; this.combo += 1; this.bestCombo = Math.max(this.bestCombo, this.combo); AudioManager.playSfx(type === 'gold' ? 'success' : 'reward');
        this.floatingText(x, y, type === 'gold' ? `GOLDEN ×${frenzy ? 6 : 3}!` : `SMASH +${value}!`, '#ffd447'); this.celebrate(x, y, type === 'gold' ? 0xffe66e : 0xffa52f); this.milestoneBurst(x, y, this.combo, 0xffa52f);
        if (isMilestone(this.combo, 8)) { this.frenzyUntil = this.time.now + FRENZY_DURATION; this.floatingText(x, y - 70, '🔥 HARVEST FRENZY!', '#ff8f3d'); this.impact(0.004); }
      } else {
        this.combo = 0; AudioManager.playSfx('button_click'); this.floatingText(x, y, target.text === '🐱' ? 'BABY BELL — SAFE!' : 'FINLEY’S HAT — SAFE!', '#ffffff');
      }
      target.destroy(); this.status.setText(`🎃 ${this.points}   COMBO ×${this.combo}${this.time.now < (this.frenzyUntil || 0) ? '  🔥×2' : ''}`);
    });
    this.time.delayedCall(S.settings.calm ? 1500 : 1150, () => {
      if (!target.active) return;
      if (type !== 'friend') { this.combo = 0; this.status.setText(`🎃 ${this.points}   COMBO ×0`); }
      this.tweens.add({ targets: target, alpha: 0, scale: 0.5, duration: 140, onComplete: () => target.destroy() });
    });
  }
  finish() {
    if (this.finished) return; this.finished = true; this.spawnEvent?.remove(); this.timerEvent?.remove(); this.activeTargets.forEach((t) => t.active && t.destroy());
    const stars = this.points >= 27 ? 3 : this.points >= 16 ? 2 : 1; const score = this.points * 75 + this.bestCombo * 25;
    const result = recordAdventure('pumpkin', score, stars, { icon: '🎃', title: 'Pumpkin Patch Champion', journal: `Hudson smashed ${this.smashed} pumpkins and kept Baby Bell safe.` });
    const rewardText = (result.critter ? `New critter: ${result.critter.icon} ${result.critter.name}!` : result.firstBadge ? 'New Pumpkin Badge + Pumpkin Outfit!' : 'A smashing result!') + (result.dailyChallenge ? ' 🌟 Double Star Day bonus!' : '');
    showAdventureResult(this, { title: 'HARVEST COMPLETE!', message: `${this.points} harvest points with a best combo of ${this.bestCombo}.`, stars, score, scoreLabel: 'Harvest score', rewardText, onReplay: () => this.scene.restart() });
  }
}
