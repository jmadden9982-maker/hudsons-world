import Phaser from 'phaser';

// Canonical asset slots for the full game. Files live under public/assets/.
// Everything is optional at runtime: scenes guard with textures.exists()/sound.get(),
// so any not-yet-committed file simply falls back — it never blocks startup.
const BG = ['mainmenu','worldmap','town','house','den','wardrobe','quests','critters',
  'photowall','journal','trophies','dash','pirate','dino','space','pumpkin','kingdom','gameover'];
const PHOTOS = 11;
const UI = ['polaroid_frame','trophy_gold','trophy_silver','trophy_bronze','button_large','panel','card'];
const SFX_KEYS = ['button_click','button_confirm','coin_pickup','bone_pickup','bone_collect',
  'reward','reward_reveal','error','achievement','achievement_fanfare','douglas_bark',
  'douglas_happy','golden_shimmer','legendary_chime','sparkle_swell'];

export default class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  preload() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 50, "Hudson's World", { fontSize: '32px', color: '#FFD23F', fontStyle: 'bold' }).setOrigin(0.5);
    const barBg = this.add.rectangle(width / 2, height / 2 + 20, 300, 20, 0x333333);
    const progress = this.add.rectangle(width / 2 - 148, height / 2 + 20, 4, 16, 0xFFD23F).setOrigin(0, 0.5);
    this.load.on('progress', (v) => { progress.width = 292 * v; });

    // Missing files are expected until art is committed — swallow errors quietly.
    this.load.on('loaderror', (file) => { console.warn('[preload] missing asset (ok):', file && file.key); });

    // Painted backgrounds  -> public/assets/bg/<name>.jpg  (key: bg_<name>)
    BG.forEach((k) => this.load.image('bg_' + k, 'assets/bg/' + k + '.jpg'));
    // Family photos        -> public/assets/photos/photo<N>.jpg  (key: photo<N>)
    for (let i = 0; i < PHOTOS; i++) this.load.image('photo' + i, 'assets/photos/photo' + i + '.jpg');
    // UI frames            -> public/assets/ui/<name>.png  (key: ui_<name>)
    UI.forEach((k) => this.load.image('ui_' + k, 'assets/ui/' + k + '.png'));
    // Character sheets     -> public/assets/spritesheets/<name>_spritesheet.png  (256x256 frames)
    this.load.spritesheet('douglas_sheet', 'assets/spritesheets/douglas_spritesheet.png', { frameWidth: 256, frameHeight: 256 });
    // hudson_spritesheet.png failed visual audit (off-model toy-figure style, no per-outfit
    // costume theming, frame 7 "space" duplicates frame 0 "everyday") — not loaded until a
    // corrected pack lands. WardrobeScene falls back to the code-drawn vector Hudson.
    // this.load.spritesheet('hudson_sheet', 'assets/spritesheets/hudson_spritesheet.png', { frameWidth: 256, frameHeight: 256 });
    // Portraits            -> public/assets/portraits/<name>_portrait.png  (key: portrait_<name>)
    // Portrait V1 (APK #87): real 512x512 RGBA portraits, extracted from the verified
    // character pack and audited PASS (see ART_INTEGRATION_PLAN.md). Re-enabled; Family
    // Quests now shows real portraits instead of the emoji fallback.
    ['hudson','douglas','babybell','finley','james','aimee'].forEach((n) => this.load.image('portrait_' + n, 'assets/portraits/' + n + '_portrait.png'));
    // SFX                  -> public/assets/audio/<key>.mp3
    SFX_KEYS.forEach((k) => this.load.audio(k, 'assets/audio/' + k + '.mp3'));
    // Looping music (optional)  -> public/assets/audio/<key>.mp3  (stays silent until committed)
    ['music_calm', 'music_playful'].forEach((k) => this.load.audio(k, 'assets/audio/' + k + '.mp3'));
  }

  create() {
    // Reached after the loader finishes (even if some optional files errored).
    this.scene.start('MainMenuScene');
  }
}
