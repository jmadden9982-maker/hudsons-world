import Phaser from 'phaser';
import { S, addAchievement, addJournal, addOutfit, addSticker, persist, totalZoneStars } from '../systems/state.js';
import { ambientMotes, button, COLORS, premiumBackdrop, queuePremiumBackdrop, roundedPanel, textStyle, topBar } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { createActor } from '../systems/CharacterActor.js';

export default class HudsonKingdomScene extends Phaser.Scene {
  constructor() { super('HudsonKingdomScene'); }
  preload() { queuePremiumBackdrop(this, 'premium-kingdom', 'assets/premium/hudson-kingdom.png'); }
  create() {
    AudioManager.setScene(this); const { width: W, height: H } = this.scale; premiumBackdrop(this, 'premium-kingdom', { shade: 0.12, drift: false, transient: true }); ambientMotes(this, { count: 24, color: 0xffdf72 }); topBar(this, 'HUDSON KINGDOM');
    this.add.text(W / 2, 310, 'WELCOME, HUDSON!', textStyle(39, COLORS.yellow, { fontStyle: 'bold', stroke: '#3b2d68', strokeThickness: 9 })).setOrigin(0.5);
    roundedPanel(this, W / 2, 550, 600, 260, 0xfffbef, 0.94, 0xd99e19);
    this.add.text(W / 2, 500, 'The five badges chose their hero.', textStyle(24, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 570, `Hudson has earned ${totalZoneStars()} adventure stars.\nThere is one royal surprise left to find…`, textStyle(19, '#655a72', { align: 'center', lineSpacing: 8 })).setOrigin(0.5);
    button(this, W / 2, 760, S.goldenDouglasFound ? 'REPLAY THE ROYAL SURPRISE' : 'OPEN THE ROYAL DOOR', () => this.goldenSequence(), { width: 470, color: 0xd99e19, fontSize: 21, sound: 'success' });
    button(this, W / 2, 860, 'EXPLORE THE TROPHY ROOM', () => this.scene.start('TrophyRoomScene'), { width: 440, color: 0x6c4ccf, fontSize: 19 });
    this.add.text(W / 2, H - 80, '👩  👨  👶  🐱   The whole family is cheering!', textStyle(20, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
  }
  goldenSequence() {
    const { width: W, height: H } = this.scale; const ov = this.add.container(0, 0).setDepth(150);
    ov.add(this.add.rectangle(W / 2, H / 2, W, H, 0x160f2a, 0.9).setInteractive());
    const rays = [];
    for (let i = 0; i < 12; i += 1) { const r = this.add.rectangle(W / 2, H / 2 - 60, 14, 600, 0xffd447, 0.35).setAngle(i * 30); rays.push(r); ov.add(r); }
    const douglasActor = createActor(this, 'douglas', W / 2, H / 2 - 80, { size: 180 });
    const dog = douglasActor.object.setTint(0xffd447).setScale(0.15); ov.add(dog);
    this.tweens.add({ targets: rays, angle: '+=120', duration: 3600 });
    this.tweens.add({ targets: dog, scale: 1, angle: 360, duration: 900, ease: 'Back.easeOut', onComplete: () => {
      douglasActor.playState('celebrate');
      ov.add(this.add.text(W / 2, H / 2 + 90, 'GOLDEN DOUGLAS!', textStyle(40, COLORS.yellow, { fontStyle: 'bold', stroke: '#3b2d68', strokeThickness: 9 })).setOrigin(0.5));
      ov.add(this.add.text(W / 2, H / 2 + 155, 'The rarest and bestest friend in the Kingdom.', textStyle(19, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5));
      ov.add(button(this, W / 2, H / 2 + 260, 'ROYAL HIGH-FIVE!', () => { S.goldenDouglasFound = true; S.kingdomVisited = true; addAchievement('golden-douglas'); addSticker('golden-douglas'); addOutfit('royal'); addJournal('golden-douglas', '👑', 'Golden Douglas Appeared!', 'Hudson opened the royal door and found the rarest friend in the whole Kingdom.'); persist(); this.scene.start('WorldMapScene'); }, { width: 370, color: 0xd99e19, depth: 160, fontSize: 21 }));
    }});
  }
}
