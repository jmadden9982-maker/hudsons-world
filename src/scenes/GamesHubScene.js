import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import SaveSystem from '../systems/SaveSystem.js';
import { FONT, COL, sceneBg, addBackButton, gameButton, makeDouglasSprite, toast } from '../ui/kit.js';

export default class GamesHubScene extends Phaser.Scene {
  constructor() { super('GamesHubScene'); }

  create() {
    AudioManager.setScene(this);
    AudioManager.playMusic('music_calm');
    const { width: W, height: H } = this.scale;

    if (this.textures.exists('bg_worldmap')) {
      sceneBg(this, 'bg_worldmap', 0x87CEEB, 0xBFE9FF);
      this.add.rectangle(0, 0, W, H, 0x0a0614, 0.18).setOrigin(0).setDepth(-50);
    } else {
      this.add.rectangle(0, 0, W, H, 0x7EC8F2).setOrigin(0);
    }

    this.add.text(W / 2, 54, '🎮 Games', { fontFamily: FONT, fontSize: '32px', color: '#ffffff', fontStyle: 'bold' })
      .setOrigin(0.5).setShadow(0, 3, '#00000088', 5);

    // Douglas greeting.
    const doug = makeDouglasSprite(this, 80, 150, 'douglas_idle');
    if (doug) doug.setScale(0.42);
    this.add.text(150, 150, 'Pick a game,\nHudson!', { fontFamily: FONT, fontSize: '18px', color: '#3b2b20', fontStyle: 'bold',
      backgroundColor: '#fffef5cc', padding: { x: 12, y: 8 } }).setOrigin(0, 0.5);

    // Daily challenge shortcut.
    gameButton(this, W - 130, 150, 220, 56, '⭐ Daily Quests', COL.berry, () => this.scene.start('FamilyQuestScene')).setDepth(20);

    const games = [
      { icon: '🐕', name: 'Douglas Dash', sub: 'Best: ' + SaveSystem.getHighScore(), scene: 'DouglasDashScene', live: true, color: COL.green },
      { icon: '🃏', name: 'Memory Match', sub: 'Find the pairs',  scene: 'MemoryMatchScene', live: true, color: COL.purp },
      { icon: '🦴', name: 'Bone Hunt',    sub: 'Find the bones',  scene: 'BoneHuntScene',    live: true, color: COL.wood },
      { icon: '👕', name: 'Dress Up',     sub: 'Style Hudson',    scene: 'WardrobeScene',    live: true, color: COL.blue },
      { icon: '🧩', name: 'Photo Puzzle', sub: 'Solve the picture', scene: 'PhotoPuzzleScene', live: true, color: 0xE59A45 }
    ];

    const colX = [W / 2 - 168, W / 2 + 168];
    const top = 300, rowGap = 210;
    games.forEach((g, i) => {
      const lastAlone = (i === games.length - 1) && (games.length % 2 === 1);
      const x = lastAlone ? W / 2 : colX[i % 2];
      const y = top + Math.floor(i / 2) * rowGap;
      this.buildCard(g, x, y);
    });

    addBackButton(this);
  }

  buildCard(g, cx, cy) {
    const cw = 300, ch = 176;
    const gfx = this.add.graphics();
    gfx.fillStyle(0x000000, 0.28); gfx.fillRoundedRect(cx - cw / 2, cy - ch / 2 + 7, cw, ch, 22);
    gfx.fillStyle(g.live ? g.color : 0x6b6258, 1); gfx.fillRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 22);
    gfx.fillStyle(0xffffff, g.live ? 0.16 : 0.06); gfx.fillRoundedRect(cx - cw / 2 + 6, cy - ch / 2 + 6, cw - 12, ch * 0.4, 16);
    gfx.lineStyle(4, 0xffffff, g.live ? 0.85 : 0.4); gfx.strokeRoundedRect(cx - cw / 2, cy - ch / 2, cw, ch, 22);

    this.add.text(cx, cy - 36, g.live ? g.icon : '🔒', { fontSize: '56px' }).setOrigin(0.5);
    this.add.text(cx, cy + 34, g.name, { fontFamily: FONT, fontSize: '22px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setShadow(0, 2, '#00000066', 3);
    this.add.text(cx, cy + 62, g.live ? g.sub : 'Coming soon', { fontFamily: FONT, fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

    const tap = this.add.rectangle(cx, cy, cw, ch, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
    tap.on('pointerdown', () => {
      if (g.live) { AudioManager.playSfx('button_confirm'); this.scene.start(g.scene); }
      else { AudioManager.playSfx('button_click'); toast(this, '🔒 ' + g.name + ' is coming soon!'); }
    });
  }
}
