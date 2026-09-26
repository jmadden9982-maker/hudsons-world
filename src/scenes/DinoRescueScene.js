import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { recordAdventure, S } from '../systems/state.js';
import { ambientMotes, button, COLORS, premiumBackdrop, queuePremiumBackdrop, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';

const nests = [
  { id: 'leaf', label: 'LEAF NEST', icon: '🌿', color: 0x4aa959 },
  { id: 'sun', label: 'SUN NEST', icon: '☀️', color: 0xe6a52d },
  { id: 'sky', label: 'SKY NEST', icon: '☁️', color: 0x4fa8dd }
];

export default class DinoRescueScene extends AdventureBase {
  constructor() { super('DinoRescueScene'); }
  preload() { queuePremiumBackdrop(this, 'premium-dino', 'assets/premium/dino-valley.png'); }
  create() {
    const { width: W } = this.scale; this.round = 0; this.correct = 0; this.mistakes = 0; this.combo = 0; this.streak = 0; this.answering = false;
    premiumBackdrop(this, 'premium-dino', { shade: 0.18, drift: false, transient: true }); ambientMotes(this, { count: 13, color: 0xcaff9a });
    this.add.text(W / 2, 150, '🦕  DINO NURSERY  🦖', textStyle(26, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    this.eggHalo = this.add.circle(W / 2, 405, 105, 0xffffff, 0.35);
    this.egg = this.add.text(W / 2, 405, '🥚', textStyle(118)).setOrigin(0.5);
    this.clue = this.add.text(W / 2, 535, '', textStyle(23, COLORS.ink, { fontStyle: 'bold', backgroundColor: '#fff8e8', padding: { x: 20, y: 12 } })).setOrigin(0.5);
    this.scoreText = this.add.text(W / 2, 610, 'Egg 1/10   ✅ 0   COMBO ×0', textStyle(19, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    nests.forEach((nest, i) => button(this, W / 2, 720 + i * 105, `${nest.icon}  ${nest.label}`, () => this.choose(nest.id), { width: 430, height: 78, color: nest.color, fontSize: 21 }));
    this.begin('DINO EGG RESCUE', 'Each baby dinosaur egg has a coloured glow. Tap the matching nest and help all ten eggs hatch safely!', '🦖');
  }
  onAdventureStart() { this.nextEgg(); }
  nextEgg() {
    if (this.round >= 10) { this.finish(); return; }
    const choices = nests.filter((nest) => nest.id !== this.target?.id); this.target = Phaser.Utils.Array.GetRandom(choices); this.eggHalo.setFillStyle(this.target.color, 0.5); this.clue.setText(`${this.target.icon} This egg has a ${this.target.label.toLowerCase()} glow`); this.scoreText.setText(`Egg ${this.round + 1}/10   ✅ ${this.correct}   COMBO ×${this.combo}`);
  }
  hatchConfetti(x, y) {
    if (S.settings.calm) return;
    for (let i = 0; i < 10; i += 1) {
      const angle = Phaser.Math.FloatBetween(-Math.PI, 0); const distance = Phaser.Math.Between(35, 80);
      const shard = this.add.text(x, y, Phaser.Utils.Array.GetRandom(['🐣', '✨']), textStyle(Phaser.Math.Between(14, 22))).setOrigin(0.5).setDepth(9);
      this.tweens.add({ targets: shard, x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance, alpha: 0, angle: Phaser.Math.Between(-90, 90), duration: 480, ease: 'Quad.easeOut', onComplete: () => shard.destroy() });
    }
  }
  choose(id) {
    if (!this.started || this.finished || this.answering) return;
    if (id === this.target.id) {
      this.answering = true; this.correct += 1; this.combo += 1; this.streak += 1; this.round += 1; AudioManager.playSfx('success'); this.floatingText(360, 405, `SAFE! COMBO ×${this.combo}`, COLORS.yellow); this.celebrate(360, 405, 0xcaff9a); this.hatchConfetti(360, 405); this.milestoneBurst(360, 405, this.streak, 0xcaff9a); this.egg.setText('🐣');
      this.tweens.add({ targets: this.egg, scale: 1.25, angle: 8, duration: 180, yoyo: true });
      this.time.delayedCall(430, () => { this.answering = false; this.egg.setText('🥚').setAngle(0); this.nextEgg(); });
    } else {
      this.answering = true; this.mistakes += 1; this.combo = 0; this.streak = 0; this.impact(0.004); AudioManager.playSfx('button_click'); this.floatingText(360, 405, 'CHECK THE SYMBOL — TRY AGAIN!', '#ffffff');
      this.tweens.add({ targets: this.egg, x: { from: 348, to: 372 }, duration: 70, yoyo: true, repeat: 2, onComplete: () => { this.egg.setX(360); this.answering = false; } });
      this.scoreText.setText(`Egg ${this.round + 1}/10   ✅ ${this.correct}   COMBO ×0`);
    }
  }
  finish() {
    if (this.finished) return; this.finished = true; const stars = this.mistakes <= 2 ? 3 : this.mistakes <= 5 ? 2 : 1; const score = Math.max(500, this.correct * 140 - this.mistakes * 30);
    const result = recordAdventure('dino', score, stars, { icon: '🦖', title: 'Dino Valley Rescue', journal: `Dino Doctor Hudson guided ${this.correct} eggs to the right nests.` });
    const rewardText = result.critter ? `New critter: ${result.critter.icon} ${result.critter.name}!` : result.firstBadge ? 'New Dino Badge + Dino Outfit!' : 'The nursery is safe and sound.';
    showAdventureResult(this, { title: 'BABY DINOS RESCUED!', message: `All ${this.correct} eggs are snug in their nests after ${this.mistakes} ${this.mistakes === 1 ? 'retry' : 'retries'}.`, stars, score, scoreLabel: 'Rescue score', rewardText, onReplay: () => this.scene.restart() });
  }
}
