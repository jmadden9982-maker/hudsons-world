// AudioManager.js — V6.0 Audio Foundation for Hudson's World
let music = null;
let currentMusicKey = null;
let sfxVolume = 0.8;
let musicVolume = 0.6;
let muted = false;

export const AudioManager = {
  init(scene) {
    if (typeof S !== 'undefined' && S.settings) {
      sfxVolume = S.settings.sfxVolume ?? 0.8;
      musicVolume = S.settings.musicVolume ?? 0.6;
      muted = S.settings.muted ?? false;
    }
    if (!music && scene.sound) {
      music = scene.sound.add('menu_theme', { loop: true, volume: musicVolume });
    }
  },
  playMusic(trackKey) {
    if (!trackKey || muted) return;
    if (currentMusicKey === trackKey && music && music.isPlaying) return;
    this.stopMusic();
    try {
      if (this.scene && this.scene.sound.get(trackKey)) {
        music = this.scene.sound.add(trackKey, { loop: true, volume: musicVolume });
        music.play();
        currentMusicKey = trackKey;
      }
    } catch (e) {}
  },
  stopMusic() {
    if (music) { music.stop(); music.destroy(); music = null; currentMusicKey = null; }
  },
  playSfx(key) {
    if (!key || muted) return;
    try {
      if (this.scene && this.scene.sound.get(key)) {
        this.scene.sound.play(key, { volume: sfxVolume });
      }
    } catch (e) {}
  },
  setMusicVolume(v) { musicVolume = Math.max(0, Math.min(1, v)); if (music) music.setVolume(musicVolume); },
  setSfxVolume(v) { sfxVolume = Math.max(0, Math.min(1, v)); },
  toggleMute() { muted = !muted; if (muted && music) music.pause(); else if (!muted && music) music.resume(); return muted; },
  setScene(scene) { this.scene = scene; }
};
window.AudioManager = AudioManager;