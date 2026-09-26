import Phaser from 'phaser';
import AdventureBase from './AdventureBase.js';
import { recordAdventure, S } from '../systems/state.js';
import { ambientMotes, COLORS, premiumBackdrop, queuePremiumBackdrop, roundedPanel, showAdventureResult, textStyle } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { nearbyTreasureCount, pickBonusIndex } from '../systems/gameplay.js';

export default class PirateDigScene extends AdventureBase {
  constructor() { super('PirateDigScene'); }
  preload() { queuePremiumBackdrop(this, 'premium-pirate', 'assets/premium/pirate-island.png'); }
  create() {
    const { width: W } = this.scale; this.turns = S.douglas.level >= 3 ? 14 : 12; this.found = 0; this.tiles = []; this.missStreak = 0;
    premiumBackdrop(this, 'premium-pirate', { shade: 0.1, drift: false, transient: true }); ambientMotes(this, { count: 10, color: 0xffed9c });
    this.status = this.add.text(W / 2, 125, `🏴‍☠️ Treasure 0/5   ⛏️ Digs ${this.turns}`, textStyle(22, '#ffffff', { fontStyle: 'bold', backgroundColor: '#6b4325', padding: { x: 18, y: 9 } })).setOrigin(0.5).setDepth(40);
    this.treasureIndexes = new Set(); while (this.treasureIndexes.size < 5) this.treasureIndexes.add(Phaser.Math.Between(0, 15));
    this.goldIndex = pickBonusIndex(this.treasureIndexes, 16, Math.random()); this.goldFound = false;
    for (let i = 0; i < 16; i += 1) {
      const x = 135 + (i % 4) * 150; const y = 315 + Math.floor(i / 4) * 155;
      const panel = roundedPanel(this, x, y, 128, 128, 0xdcae58, 0.9, 0xffe088);
      const mark = this.add.text(x, y, '✕', textStyle(42, '#70441c', { fontStyle: 'bold', stroke: '#f7d986', strokeThickness: 2 })).setOrigin(0.5);
      const hit = this.add.zone(x, y, 128, 128).setInteractive({ useHandCursor: true });
      hit.setData({ index: i, treasure: this.treasureIndexes.has(i), used: false, panel, mark });
      hit.on('pointerdown', () => this.dig(hit)); this.tiles.push(hit);
    }
    this.add.text(W / 2, 1040, 'Douglas says: “I can smell treasure… or lunch.”', textStyle(18, COLORS.brown, { fontStyle: 'bold' })).setOrigin(0.5);
    this.begin('PIRATE ISLAND', 'Dig beneath the X marks. Empty spots reveal how many treasures are nearby, and Douglas’s compass gives a hint after two misses. Use the clues to find all five chests — and keep an eye out for one Lucky Chest hidden anywhere on the map!', '🏴‍☠️');
  }
  nearbyCount(index) {
    return nearbyTreasureCount(index, this.treasureIndexes);
  }
  compassHint() {
    const hidden = this.tiles.filter((tile) => tile.getData('treasure') && !tile.getData('used'));
    if (!hidden.length) return; const hint = Phaser.Utils.Array.GetRandom(hidden).getData('mark');
    this.floatingText(360, 980, '🧭 DOUGLAS’S COMPASS IS GLOWING!', '#ffd447');
    this.tweens.add({ targets: hint, scale: 1.45, alpha: 0.35, duration: 260, yoyo: true, repeat: 3 });
  }
  digPuff(x, y, color = 0xdcae58) {
    if (S.settings.calm) return;
    for (let i = 0; i < 7; i += 1) {
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); const distance = Phaser.Math.Between(20, 48);
      const grain = this.add.circle(x, y, Phaser.Math.Between(3, 6), color, 0.85).setDepth(9);
      this.tweens.add({ targets: grain, x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance - 12, alpha: 0, duration: 340, ease: 'Quad.easeOut', onComplete: () => grain.destroy() });
    }
  }
  dig(tile) {
    if (!this.started || this.finished || tile.getData('used')) return;
    tile.setData('used', true); this.turns -= 1;
    const index = tile.getData('index'); const treasure = tile.getData('treasure'); const isGold = index === this.goldIndex; const mark = tile.getData('mark');
    this.tweens.add({ targets: mark, scale: { from: 0.4, to: 1 }, duration: 220, ease: 'Back.easeOut' });
    if (isGold) {
      mark.setFontSize(38).setText('💎'); this.goldFound = true; this.missStreak = 0; AudioManager.playSfx('reward'); this.floatingText(tile.x, tile.y, 'LUCKY CHEST!', '#8fe7ff'); this.digPuff(tile.x, tile.y, 0x8fe7ff); this.celebrate(tile.x, tile.y, 0x8fe7ff);
    } else if (treasure) {
      mark.setFontSize(38).setText('💰'); this.found += 1; this.missStreak = 0; AudioManager.playSfx('reward'); this.floatingText(tile.x, tile.y, 'TREASURE!', COLORS.yellow); this.digPuff(tile.x, tile.y, 0xffd447); this.celebrate(tile.x, tile.y, 0xffd447); this.milestoneBurst(tile.x, tile.y, this.found, 0xffd447);
    } else {
      const nearby = this.nearbyCount(index); mark.setFontSize(18).setText(nearby ? `${nearby}\nNEAR` : '🌊\nCLEAR'); this.missStreak += 1; AudioManager.playSfx('button_click'); this.floatingText(tile.x, tile.y, nearby ? `${nearby} TREASURE ${nearby === 1 ? 'IS' : 'ARE'} CLOSE!` : 'CLEAR SAND', '#ffffff'); this.digPuff(tile.x, tile.y);
      if (this.missStreak >= 2) { this.missStreak = 0; this.compassHint(); }
    }
    this.status.setText(`🏴‍☠️ Treasure ${this.found}/5   ⛏️ Digs ${this.turns}`);
    if (this.found >= 5 || this.turns <= 0) this.time.delayedCall(500, () => this.finish());
  }
  finish() {
    if (this.finished) return; this.finished = true; const stars = this.found >= 5 ? 3 : this.found >= 3 ? 2 : 1; const score = this.found * 200 + this.turns * 25 + (this.goldFound ? 150 : 0);
    const result = recordAdventure('pirate', score, stars, { icon: '🏴‍☠️', title: 'Pirate Island Treasure', journal: `Captain Hudson uncovered ${this.found} hidden treasures with Douglas.` });
    const rewardText = (result.critter ? `New critter: ${result.critter.icon} ${result.critter.name}!` : result.firstBadge ? 'New Pirate Badge + Captain Outfit!' : 'The treasure map has been saved.') + (result.dailyChallenge ? ' 🌟 Double Star Day bonus!' : '');
    const goldLine = this.goldFound ? ' Douglas also sniffed out the Lucky Chest!' : '';
    showAdventureResult(this, { title: 'TREASURE HUNT COMPLETE!', message: `${this.found >= 5 ? 'Captain Hudson found every chest!' : 'A good pirate always maps the next dig.'}${goldLine}`, stars, score, scoreLabel: 'Treasure score', rewardText, onReplay: () => this.scene.restart() });
  }
}
