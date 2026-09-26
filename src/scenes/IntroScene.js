import Phaser from 'phaser';
import { S, addJournal, persist } from '../systems/state.js';
import { ambientMotes, button, COLORS, premiumBackdrop, roundedPanel, textStyle } from '../ui/kit.js';
import Narrator from '../systems/Narrator.js';

const pages = [
  { icon: '👦', title: 'Meet Hudson', text: 'Explorer. Builder. Dino expert. Brilliant big brother.' },
  { icon: '🐶', title: 'Meet Douglas', text: 'Hudson’s sausage-dog sidekick. Fast paws. Brave heart. Always hungry.' },
  { icon: '👨‍👩‍👦‍👦', title: 'The Family Team', text: 'Mum Aimee, Dad James and little Finley are ready to help on every adventure.' },
  { icon: '🐱', title: 'Watch for Baby Bell!', text: 'The cheekiest cat in Hudson Town loves hiding in surprising places.' },
  { icon: '🏰', title: 'Your Big Mission', text: 'Earn one badge in every adventure to open the gates of Hudson Kingdom!' }
];

export default class IntroScene extends Phaser.Scene {
  constructor() { super('IntroScene'); }
  create() { this.page = 0; Narrator.attach(this); this.draw(); }
  draw() {
    this.children.removeAll();
    const { width: W, height: H } = this.scale; const p = pages[this.page];
    premiumBackdrop(this, 'premium-title', { shade: 0.38, drift: false }); ambientMotes(this, { count: 12, color: 0xffe38d });
    this.add.text(W / 2, 85, `STORY ${this.page + 1} / ${pages.length}`, textStyle(17, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    roundedPanel(this, W / 2, H / 2 - 40, 610, 650, 0xfffbef, 1, 0xffd447);
    this.add.text(W / 2, H / 2 - 210, p.icon, textStyle(130)).setOrigin(0.5);
    this.add.text(W / 2, H / 2 - 55, p.title, textStyle(36, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, H / 2 + 55, p.text, textStyle(24, '#625773', { align: 'center', wordWrap: { width: 490 }, lineSpacing: 8 })).setOrigin(0.5);
    const last = this.page === pages.length - 1;
    button(this, W / 2, H / 2 + 145, '🔊 READ TO ME', () => Narrator.speak(`${p.title}. ${p.text}`), { width: 250, height: 54, color: 0x47a8e8, fontSize: 17 });
    button(this, W / 2, H / 2 + 235, last ? 'OPEN THE MAP!' : 'NEXT ›', () => {
      if (last) {
        S.seenIntro = true; addJournal('welcome', '🌈', 'Hudson’s Adventure Began', 'Hudson and Douglas set off to earn five badges and open the Kingdom gates.'); persist();
        this.scene.start('WorldMapScene');
      } else { this.page += 1; this.draw(); }
    }, { width: 330, color: last ? 0x40a95b : 0x6c4ccf });
    if (!last) button(this, W / 2, H - 90, 'SKIP STORY', () => { S.seenIntro = true; persist(); this.scene.start('WorldMapScene'); }, { width: 220, height: 54, color: 0x7d7391, fontSize: 17 });
  }
}
