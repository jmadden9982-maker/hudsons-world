import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import { FONT, COL, sceneBg, addBackButton, gameButton } from '../ui/kit.js';
import { grantReward, addJournal, photoUnlocked } from '../systems/progression.js';

const TOTAL_PHOTOS = 11;
const GRID = 3;

export default class PhotoPuzzleScene extends Phaser.Scene {
  constructor() { super('PhotoPuzzleScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_playful');
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_house')) {
      sceneBg(this, 'bg_house', 0xFFF1DA, 0xE7C9A0);
      this.add.rectangle(0, 0, W, H, 0xFFF1DA, 0.5).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0xFFF1DA).setOrigin(0);
    }

    this.add.text(W / 2, 52, '🧩 Photo Puzzle', { fontFamily: FONT, fontSize: '28px', color: '#7a4a00', fontStyle: 'bold' }).setOrigin(0.5);
    this.statusText = this.add.text(W / 2, 92, 'Tap two tiles to swap them!', { fontFamily: FONT, fontSize: '16px', color: '#5a4632', fontStyle: 'bold' }).setOrigin(0.5);

    // Pick an unlocked photo that actually has a loaded texture; fall back safely.
    this.photoKey = this.choosePhoto();

    // Reference thumbnail (goal image).
    if (this.photoKey) {
      const ref = this.add.image(W / 2, 158, this.photoKey).setDisplaySize(150, 112);
      this.add.rectangle(W / 2, 158, 156, 118).setStrokeStyle(3, 0xB07B4F).setFillStyle();
      ref.setDepth(1);
    }

    this.buildBoard();
    addBackButton(this);
  }

  choosePhoto() {
    const unlocked = [];
    for (let i = 0; i < TOTAL_PHOTOS; i++) {
      if (photoUnlocked(i, TOTAL_PHOTOS) && this.textures.exists('photo' + i)) unlocked.push('photo' + i);
    }
    if (unlocked.length) return Phaser.Utils.Array.GetRandom(unlocked);
    if (this.textures.exists('photo0')) return 'photo0';
    return null; // numbered-tile fallback
  }

  buildBoard() {
    const { width: W } = this.scale;
    const board = 540, tile = board / GRID, disp = tile - 6;
    const startX = W / 2 - board / 2 + tile / 2;
    const startY = 320 + tile / 2;
    this.slots = [];
    for (let i = 0; i < GRID * GRID; i++) {
      this.slots.push({ x: startX + (i % GRID) * tile, y: startY + Math.floor(i / GRID) * tile });
    }

    // Backing panel.
    this.add.rectangle(W / 2, startY + tile, board + 16, board + 16, 0x3b2b20, 0.25).setDepth(0);

    // Define 9 sub-frames on the photo texture (once).
    if (this.photoKey) {
      const tex = this.textures.get(this.photoKey);
      const src = tex.getSourceImage();
      const fw = Math.floor(src.width / GRID), fh = Math.floor(src.height / GRID);
      for (let i = 0; i < GRID * GRID; i++) {
        const fn = 'pp_' + i;
        if (!tex.has(fn)) tex.add(fn, 0, (i % GRID) * fw, Math.floor(i / GRID) * fh, fw, fh);
      }
    }

    // Shuffle a placement order (not already solved).
    let order = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    if (order.every((v, i) => v === i)) order = order.reverse();

    this.tiles = [];
    this.selected = null;
    this.locked = false;
    order.forEach((correct, slot) => {
      const s = this.slots[slot];
      let obj;
      if (this.photoKey) {
        obj = this.add.image(s.x, s.y, this.photoKey, 'pp_' + correct).setDisplaySize(disp, disp).setDepth(2);
      } else {
        obj = this.add.container(s.x, s.y).setDepth(2);
        const r = this.add.rectangle(0, 0, disp, disp, [0x81D4FA, 0xFF9AA2, 0x5BA838, 0xFFD23F, 0x9B6DD7, 0x3FA7D6, 0xE59A45, 0xE5728F, 0x6FD66F][correct]);
        obj.add([r, this.add.text(0, 0, '' + (correct + 1), { fontFamily: FONT, fontSize: '48px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5)]);
        obj.setSize(disp, disp);
      }
      obj.setInteractive({ useHandCursor: true });
      const tileObj = { obj, correct, slot };
      obj.on('pointerdown', () => this.pick(tileObj));
      this.tiles.push(tileObj);
    });

    this.selRect = this.add.rectangle(0, 0, disp + 6, disp + 6).setStrokeStyle(5, 0xFFD23F).setDepth(5).setVisible(false);
  }

  pick(t) {
    if (this.locked) return;
    AudioManager.playSfx('button_click');
    if (!this.selected) {
      this.selected = t;
      this.selRect.setPosition(this.slots[t.slot].x, this.slots[t.slot].y).setVisible(true);
      return;
    }
    if (this.selected === t) { this.selected = null; this.selRect.setVisible(false); return; }
    this.swap(this.selected, t);
    this.selected = null;
    this.selRect.setVisible(false);
  }

  swap(a, b) {
    const sa = a.slot, sb = b.slot;
    a.slot = sb; b.slot = sa;
    this.tweens.add({ targets: a.obj, x: this.slots[sb].x, y: this.slots[sb].y, duration: 140, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: b.obj, x: this.slots[sa].x, y: this.slots[sa].y, duration: 140, ease: 'Quad.easeOut' });
    if (this.tiles.every(t => t.correct === t.slot)) this.win();
  }

  win() {
    this.locked = true;
    AudioManager.playSfx('achievement');
    this.statusText.setText('You solved it! 🎉');
    addJournal('photo_puzzle_win', '🧩', 'Puzzle Master', 'Hudson put a whole picture back together!');
    grantReward(this, 15, 12, 'Puzzle complete!');
    const { width: W, height: H } = this.scale;
    gameButton(this, W / 2 - 110, H - 150, 200, 60, '🔁 Again', COL.green, () => this.scene.restart()).setDepth(60);
    gameButton(this, W / 2 + 110, H - 150, 200, 60, '🎮 Games', COL.wood, () => this.scene.start('GamesHubScene')).setDepth(60);
  }
}
