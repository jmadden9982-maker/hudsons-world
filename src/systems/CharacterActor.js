// Character animation framework.
//
// Every scene should render Hudson, Douglas, Finley, Baby Bell, Aimee and James
// through `createActor()` instead of a raw `scene.add.text(icon)`. Today every
// character falls back to an emoji glyph with procedural "juice" (idle bob, walk
// bounce, celebrate spin, hurt flash) so the game already feels animated. The
// moment a real spritesheet is registered in src/data/characters.js and preloaded,
// the same call automatically renders a true animated sprite instead — no scene
// code has to change.
import { S } from './state.js';
import { textStyle } from '../ui/kit.js';
import { getCharacter, getCharacterArt } from '../data/characters.js';
import { animKey, facingScale } from './characterMotion.js';

export { animKey, facingScale };

function ensureAnimations(scene, id, art) {
  Object.entries(art.states).forEach(([state, cfg]) => {
    const key = animKey(id, state);
    if (scene.anims.exists(key)) return;
    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers(art.texture, { start: cfg.start, end: cfg.end }),
      frameRate: cfg.frameRate || 10,
      repeat: cfg.repeat ?? -1
    });
  });
}

export class CharacterActor {
  constructor(scene, id, x, y, options = {}) {
    this.scene = scene;
    this.id = id;
    this.options = options;
    this.baseScale = options.scale ?? 1;
    this.state = 'idle';

    const character = getCharacter(id) || { emoji: options.fallbackIcon || '❓', color: 0xffffff };
    const art = getCharacterArt(id);
    this.hasArt = Boolean(art && scene.textures.exists(art.texture));

    if (this.hasArt) {
      ensureAnimations(scene, id, art);
      this.object = scene.add.sprite(x, y, art.texture).setDepth(options.depth ?? 15);
      this.object.setScale(this.baseScale);
    } else {
      const icon = options.icon || character.emoji;
      this.object = scene.add
        .text(x, y, icon, textStyle(options.size || 72, '#ffffff', { stroke: '#ffffff', strokeThickness: 3 }))
        .setOrigin(0.5)
        .setDepth(options.depth ?? 15);
      this.object.setScale(this.baseScale);
    }
    this.playState('idle');
  }

  get x() { return this.object.x; }
  set x(value) { this.object.x = value; }
  get y() { return this.object.y; }
  set y(value) { this.object.y = value; }

  setPosition(x, y) {
    this.object.setPosition(x, y);
    return this;
  }

  setFacing(direction) {
    this.object.setScale(facingScale(this.baseScale, direction), Math.abs(this.baseScale));
    return this;
  }

  playState(state) {
    this.state = state;
    this.scene.tweens.killTweensOf(this.object);
    if (this.hasArt) {
      const key = animKey(this.id, state);
      if (this.scene.anims.exists(key)) this.object.play(key, true);
      return this;
    }
    this._playFallback(state);
    return this;
  }

  _playFallback(state) {
    const calm = S.settings.calm;
    this.object.setAngle(0);
    this.object.setAlpha(1);
    this.object.setScale(this.baseScale);
    if (calm && state !== 'hurt') return;
    if (state === 'celebrate') {
      this.scene.tweens.add({
        targets: this.object, angle: { from: -12, to: 12 }, scaleX: this.baseScale * 1.15, scaleY: this.baseScale * 1.15,
        duration: 130, yoyo: true, repeat: 3, ease: 'Sine.easeInOut',
        onComplete: () => { this.object.setAngle(0); this.object.setScale(this.baseScale); this.playState('idle'); }
      });
    } else if (state === 'hurt') {
      this.scene.tweens.add({
        targets: this.object, alpha: 0.35, duration: 90, yoyo: true, repeat: 3,
        onComplete: () => { this.object.setAlpha(1); this.playState('idle'); }
      });
    } else if (state === 'walk' || state === 'run') {
      this.scene.tweens.add({
        targets: this.object, y: this.object.y - (calm ? 4 : 9), angle: { from: -5, to: 5 },
        duration: calm ? 320 : 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    } else if (state === 'jump') {
      this.scene.tweens.add({ targets: this.object, scaleY: this.baseScale * 1.18, scaleX: this.baseScale * 0.9, duration: 140, yoyo: true, ease: 'Sine.easeOut' });
    } else {
      this.scene.tweens.add({
        targets: this.object, y: this.object.y - 6, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }
  }

  destroy() {
    this.scene.tweens.killTweensOf(this.object);
    this.object.destroy();
  }
}

export function createActor(scene, id, x, y, options = {}) {
  return new CharacterActor(scene, id, x, y, options);
}
