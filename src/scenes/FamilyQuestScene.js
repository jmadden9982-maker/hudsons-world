import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, COL, sceneBg, addBackButton, gameButton } from '../ui/kit.js';
import { getQuests, claim, openLine } from '../systems/family.js';

export default class FamilyQuestScene extends Phaser.Scene {
  constructor() { super('FamilyQuestScene'); }

  create() {
    AudioManager.setScene(this);
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_house')) {
      sceneBg(this, 'bg_house', 0xFFF1DA, 0xE7C9A0);
      this.add.rectangle(0, 0, W, H, 0xFFF1DA, 0.5).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0xFFF1DA).setOrigin(0);
    }

    this.add.text(W / 2, 56, '👨‍👩‍👧 Family Quests', {
      fontFamily: FONT, fontSize: '30px', color: '#7a4a00', fontStyle: 'bold'
    }).setOrigin(0.5).setShadow(0, 2, '#ffffff', 3);

    this.bubble = this.add.text(W / 2, 104, 'Tap a family member to see their quest!', {
      fontFamily: FONT, fontSize: '16px', color: '#5a4632', fontStyle: 'bold',
      backgroundColor: '#fffef5cc', padding: { x: 14, y: 8 }, align: 'center', wordWrap: { width: W * 0.9 }
    }).setOrigin(0.5).setDepth(40);

    this.cards = {};
    const quests = getQuests();
    const top = 190, rowH = 232;
    quests.forEach((q, i) => this.buildCard(q, W / 2, top + i * rowH));

    addBackButton(this);
  }

  buildCard(q, cx, cy) {
    const W = this.scale.width;
    const cardW = W - 60, cardH = 210;

    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18); g.fillRoundedRect(cx - cardW / 2, cy - cardH / 2 + 6, cardW, cardH, 22);
    g.fillStyle(0xFFFDF6, 1);   g.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 22);
    g.lineStyle(3, 0xE0A86B, 0.9); g.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 22);

    // Portrait (image if present, else emoji avatar on a disc).
    const px = cx - cardW / 2 + 86;
    this.add.circle(px, cy, 64, 0xFFE9C9).setStrokeStyle(3, 0xE0A86B);
    if (this.textures.exists(q.member.portrait)) {
      const img = this.add.image(px, cy, q.member.portrait);
      const s = Math.min(112 / img.width, 112 / img.height);
      img.setScale(s);
      const mask = this.add.circle(px, cy, 60, 0xffffff).setVisible(false);
      img.setMask(mask.createGeometryMask());
    } else {
      this.add.text(px, cy, q.member.avatar, { fontSize: '60px' }).setOrigin(0.5);
    }

    const tx = px + 92;
    this.add.text(tx, cy - 74, q.member.name, { fontFamily: FONT, fontSize: '20px', color: '#3b2b20', fontStyle: 'bold' }).setOrigin(0, 0.5);
    this.add.text(tx, cy - 42, q.quest.text, { fontFamily: FONT, fontSize: '16px', color: '#5a4632', wordWrap: { width: cardW - 200 } }).setOrigin(0, 0);

    // Progress bar.
    const barX = tx, barY = cy + 8, barW = cardW - 200, barH = 18;
    const pg = this.add.graphics();
    pg.fillStyle(0x000000, 0.18); pg.fillRoundedRect(barX, barY, barW, barH, 9);
    pg.fillStyle(q.complete ? 0x5BA838 : 0x3FA7D6, 1);
    pg.fillRoundedRect(barX, barY, Math.max(6, barW * (q.prog / q.goal)), barH, 9);
    this.add.text(barX + barW, barY - 2, q.prog + ' / ' + q.goal, { fontFamily: FONT, fontSize: '13px', color: '#5a4632', fontStyle: 'bold' }).setOrigin(1, 0);

    // Reward + claim/status.
    const reward = '⭐' + (q.quest.reward.stars || 0) + (q.quest.reward.xp ? '  +' + q.quest.reward.xp + 'XP' : '');
    this.add.text(tx, cy + 44, 'Reward: ' + reward, { fontFamily: FONT, fontSize: '14px', color: '#7a5a28', fontStyle: 'bold' }).setOrigin(0, 0.5);

    const rightX = cx + cardW / 2 - 92;
    if (q.claimed) {
      this.add.text(rightX, cy + 44, '✓ Done', { fontFamily: FONT, fontSize: '18px', color: '#2e7d32', fontStyle: 'bold' }).setOrigin(0.5);
    } else if (q.complete) {
      gameButton(this, rightX, cy + 44, 150, 54, 'Claim ⭐', COL.green, () => this.claimQuest(q.key));
    } else {
      this.add.text(rightX, cy + 44, 'In progress', { fontFamily: FONT, fontSize: '14px', color: '#9a8a70', fontStyle: 'bold' }).setOrigin(0.5);
    }

    // Tap portrait area to hear their opening line.
    const tap = this.add.rectangle(px, cy, 130, cardH, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
    tap.on('pointerdown', () => { AudioManager.playSfx('button_click'); this.setBubble(openLine(q.key)); });
  }

  claimQuest(key) {
    const r = claim(this, key);
    if (r) {
      this.setBubble(r.line);
      this.time.delayedCall(400, () => this.scene.restart()); // redraw card as claimed
    }
  }

  setBubble(text) { if (this.bubble) this.bubble.setText(text); }
}
