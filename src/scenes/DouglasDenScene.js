import Phaser from 'phaser';
import { careForDouglas, S } from '../systems/state.js';
import { button, celebrateAt, COLORS, milestoneBurstAt, paintBackground, progressBar, roundedPanel, textStyle, toast, topBar } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { DOUGLAS_ABILITIES, DOUGLAS_SKINS } from '../data/collections.js';
import { persist } from '../systems/state.js';
import { createActor } from '../systems/CharacterActor.js';

const CARE_COUNTER = { pet: 'pets', treat: 'treats', play: 'games' };

export default class DouglasDenScene extends Phaser.Scene {
  constructor() { super('DouglasDenScene'); }
  create() {
    AudioManager.setScene(this); const { width: W } = this.scale; paintBackground(this, 0xe2bd87, 0x9c6d43); topBar(this, 'DOUGLAS DEN');
    roundedPanel(this, W / 2, 510, 620, 830, 0xfff6df, 0.98, 0x9b683d);
    const skin = DOUGLAS_SKINS.find((item) => item.id === S.douglas.skin) || DOUGLAS_SKINS[0];
    this.douglasActor = createActor(this, 'douglas', W / 2, 210, { icon: skin.icon, size: 105 });
    this.add.text(W / 2, 315, this.moodLine(), textStyle(23, COLORS.brown, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 360, `LEVEL ${S.douglas.level} • ${DOUGLAS_ABILITIES[S.douglas.level - 1]}`, textStyle(17, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    progressBar(this, W / 2, 405, 470, S.douglas.level === 5 ? 60 : S.douglas.xp % 60, 60, 0xd99e19);
    this.add.text(115, 465, 'BEST-FRIEND JOY', textStyle(15, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0, 0.5);
    progressBar(this, W / 2, 505, 470, S.douglas.joy, 100, 0xf36f5f);
    button(this, W / 2, 610, '🤚 PET DOUGLAS', () => this.care('pet', 'Tail-wag level: enormous.'), { width: 390, height: 68, color: 0xf36f5f, fontSize: 20 });
    button(this, W / 2, 695, '🦴 GIVE A TREAT', () => this.care('treat', 'Crunch. Gone in half a second.'), { width: 390, height: 68, color: 0x40a95b, fontSize: 20 });
    button(this, W / 2, 780, '🎾 PLAY FETCH', () => this.care('play', 'Douglas wins. Douglas always wins.'), { width: 390, height: 68, color: 0x47a8e8, fontSize: 20 });
    button(this, W / 2, 875, '🎨 DOUGLAS LOOKS', () => this.showSkins(), { width: 360, height: 62, color: 0x8b63c7, fontSize: 18 });
    this.add.text(W / 2, 965, `Pets ${S.douglas.pets} • Treats ${S.douglas.treats} • Games ${S.douglas.games}`, textStyle(15, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 1010, 'Douglas never gets sad while you are away.', textStyle(16, '#ffffff')).setOrigin(0.5);
  }
  moodLine() { return S.douglas.joy >= 100 ? 'BEST FRIENDS FOREVER!' : S.douglas.joy >= 80 ? 'Douglas is delighted!' : 'Douglas is ready to play!'; }
  care(action, message) {
    careForDouglas(action); AudioManager.playSfx('douglas_happy'); this.douglasActor.playState('celebrate');
    const { width: W } = this.scale;
    celebrateAt(this, W / 2, 210, 0x9b683d);
    milestoneBurstAt(this, W / 2, 210, S.douglas[CARE_COUNTER[action]], 0x9b683d);
    toast(this, message, 0x9b683d, 1100); this.time.delayedCall(600, () => this.scene.restart());
  }
  showSkins() {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(150);
    ov.add(this.add.rectangle(W / 2, H / 2, W, H, 0x171126, 0.86).setInteractive());
    ov.add(roundedPanel(this, W / 2, H / 2, 620, 760, 0xfffbef, 1, 0x8b63c7).setDepth(151));
    ov.add(this.add.text(W / 2, 330, 'CHOOSE DOUGLAS’ LOOK', textStyle(25, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5).setDepth(152));
    DOUGLAS_SKINS.forEach((skin, i) => {
      const y = 435 + i * 105; const open = S.douglas.skins.includes(skin.id);
      ov.add(button(this, W / 2, y, open ? `${skin.icon}  ${skin.name}${S.douglas.skin === skin.id ? '  ✓' : ''}` : `🔒  Level ${skin.needLevel}`, () => {
        if (!open) { toast(this, `Douglas unlocks this look at level ${skin.needLevel}.`, 0x8b63c7); return; }
        S.douglas.skin = skin.id; persist(); this.scene.restart();
      }, { width: 450, height: 70, color: open ? 0x8b63c7 : 0x81788e, fontSize: 17, depth: 153 }));
    });
  }
}
