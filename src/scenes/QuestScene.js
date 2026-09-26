import Phaser from 'phaser';
import { claimQuest, S } from '../systems/state.js';
import { button, celebrateAt, COLORS, paintBackground, progressBar, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';

const quests = [
  { id: 'bones', icon: '🦴', title: 'Douglas’ Bone Box', text: 'Collect 20 bones in Douglas Dash' },
  { id: 'adventures', icon: '🗺️', title: 'Five-Zone Explorer', text: 'Earn a badge in every adventure' },
  { id: 'friend', icon: '🐶', title: 'Best-Friend Time', text: 'Care for Douglas three times' }
];

export default class QuestScene extends Phaser.Scene {
  constructor() { super('QuestScene'); }
  create() {
    const { width: W } = this.scale; paintBackground(this, 0x7ecdf0, 0x529c6a); topBar(this, 'FAMILY QUESTS');
    this.add.text(W / 2, 125, 'Finish at your own pace. Quests never expire.', textStyle(17, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    quests.forEach((info, i) => {
      const q = S.quests[info.id]; const y = 295 + i * 270; roundedPanel(this, W / 2, y, 620, 220, 0xfffbef, 0.98, q.claimed ? 0x40a95b : 0x6c4ccf);
      this.add.text(105, y - 35, info.icon, textStyle(52)).setOrigin(0.5);
      this.add.text(170, y - 55, info.title, textStyle(21, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
      this.add.text(170, y - 20, info.text, textStyle(15, '#655a72')).setOrigin(0, 0.5);
      progressBar(this, 340, y + 32, 340, q.value, q.goal, q.claimed ? 0x40a95b : 0x6c4ccf);
      this.add.text(520, y + 32, `${q.value}/${q.goal}`, textStyle(15, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
      if (q.claimed) this.add.text(590, y + 70, '✅ CLAIMED', textStyle(14, '#39824b', { fontStyle: 'bold' })).setOrigin(0.5);
      else if (q.value >= q.goal) button(this, 560, y + 70, 'CLAIM ⭐⭐', () => { claimQuest(info.id); celebrateAt(this, W / 2, y, 0x40a95b); toast(this, 'Two bonus stars added!', 0x40a95b); this.time.delayedCall(550, () => this.scene.restart()); }, { width: 190, height: 52, color: 0x40a95b, fontSize: 15 });
      else this.add.text(560, y + 70, 'REWARD ⭐⭐', textStyle(14, '#6c4ccf', { fontStyle: 'bold' })).setOrigin(0.5);
    });
  }
}
