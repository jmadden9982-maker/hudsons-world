import Phaser from 'phaser';
import { FONT, makeHUD, makeDock, sceneBg, addBackButton } from '../ui/kit.js';
import { S, photosUnlocked } from '../systems/state.js';
import { SFX } from '../systems/audio.js';
import { feel } from '../systems/feel.js';
import { PHOTO_CAPS } from '../data/quests.js';

const TOTAL = 11;

export default class FamilyPhotoWallScene extends Phaser.Scene {
  constructor() { super('FamilyPhotoWallScene'); }

  create() {
    const { width:W, height:H } = this.scale;

    const hasArt = this.textures.exists('bg_photowall');
    if (hasArt) sceneBg(this, 'bg_photowall', 0x4E3015, 0x5E3A1C);
    else this.add.rectangle(0, 0, W, H, 0x3E2723).setOrigin(0);

    this.add.text(W/2, 26, '📸 Family Photo Wall', { fontFamily: FONT, fontSize: '26px', color: '#FFE9C9', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(W/2, 56, photosUnlocked(TOTAL) + ' / ' + TOTAL + ' photos unlocked — tap one to see it big!', { fontFamily: FONT, fontSize: '14px', color: '#FFE9C9' }).setOrigin(0.5);

    const cols = 6;
    const cw = 116;
    const ch = 118;
    const gx = (W - cols*cw)/2 + cw/2;
    const gy = 120;

    for (let i = 0; i < TOTAL; i++) {
      const x = gx + (i%cols)*cw;
      const y = gy + Math.floor(i/cols)*ch;
      const bonus = i === TOTAL-1;
      const unlocked = bonus ? S.kingdom : S.level >= i+1;

      const fr = this.add.container(x, y).setAngle(Phaser.Math.Between(-3, 3));

      if (unlocked && this.textures.exists('photo'+i)) {
        if (this.textures.exists('ui_polaroid_frame')) {
          const frame = this.add.image(0, -10, 'ui_polaroid_frame');
          const fs = Math.min(108 / frame.width, 116 / frame.height);
          frame.setScale(fs);
          fr.add(frame);
        } else {
          const g = this.add.graphics();
          g.fillStyle(0xFFFDF6, 1);
          g.fillRoundedRect(-54, -58, 108, 116, 8);
          g.lineStyle(4, 0xB07B4F, 1);
          g.strokeRoundedRect(-54, -58, 108, 116, 8);
          fr.add(g);
        }

        const img = this.add.image(0, -10, 'photo' + i);
        const scale = Math.min(78 / img.width, 64 / img.height);
        img.setScale(scale);
        fr.add(img);

        fr.add(this.add.text(0, 44, PHOTO_CAPS[i] || ('Memory ' + (i + 1)), {
          fontFamily: FONT, fontSize: '11px', color: '#3b2b20', fontStyle: 'bold', align: 'center', wordWrap: { width: 100 }
        }).setOrigin(0.5));

        fr.setSize(108, 116).setInteractive({ useHandCursor: true });
        fr.on('pointerdown', () => {
          feel(this, 'photo_unlock', 'success');
          this.showBigPhoto(i);
        });
      } else {
        fr.add(this.add.text(0, -10, '🔒', { fontSize: '36px' }).setOrigin(0.5));
        fr.add(this.add.text(0, 42, bonus ? 'Unlock Kingdom!' : 'Reach Lv ' + (i + 1), {
          fontFamily: FONT, fontSize: '11px', color: '#888', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5));
      }
    }

    this.add.text(W/2, H-66, 'Real memories. Real adventures. Real love. 💛', {
      fontFamily: FONT, fontSize: '15px', color: '#FFE9C9', fontStyle: 'italic'
    }).setOrigin(0.5);

    makeHUD(this); makeDock(this, '');
    addBackButton(this);
  }

  showBigPhoto(i) {
    feel(this, 'photo_unlock', 'success');
    const { width: W, height: H } = this.scale;
    const ov = this.add.container(0, 0).setDepth(80);
    ov.add(this.add.rectangle(W/2, H/2, W, H, 0x0a0614, 0.9).setInteractive());

    const img = this.add.image(W/2, H/2 - 20, 'photo' + i);
    const s = Math.min(W * 0.72 / img.width, H * 0.68 / img.height);
    img.setScale(s).setAngle(-1.2);

    const fr = this.add.rectangle(W/2, H/2 - 20, img.displayWidth + 20, img.displayHeight + 20, 0xffffff).setAngle(-1.2);
    ov.add([fr, img]);

    ov.add(this.add.text(W/2, H/2 + img.displayHeight/2 + 10, PHOTO_CAPS[i] || ('Memory ' + (i + 1)), {
      fontFamily: FONT, fontSize: '22px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5));

    const close = this.add.text(W/2, H - 55, 'Close 💛', {
      fontFamily: FONT, fontSize: '20px', color: '#fff', fontStyle: 'bold', backgroundColor: '#5BA838', padding: { x: 22, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    ov.add(close);
    const kill = () => { feel(this, 'button_click', 'tap'); ov.destroy(); };
    close.on('pointerdown', kill);
    ov.list[0].on('pointerdown', kill);
  }
}