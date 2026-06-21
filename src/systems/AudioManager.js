const AudioManager = {
  scene: null,
  music: null,
  currentMusicKey: null,

  musicVolume: 0.3,
  sfxVolume: 0.7,
  muted: false,

  init(scene) {
    this.scene = scene;

    // Load saved settings
    const saved = SaveSystem.load('audioSettings', null);
    if (saved) {
      this.musicVolume = saved.musicVolume ?? 0.7;
      this.sfxVolume = saved.sfxVolume ?? 0.85;
      this.muted = saved.muted ?? false;
    }
  },

  // === MUSIC ===
  playMusic(key) {
    if (!this.scene || this.muted || !key) return;
    if (this.currentMusicKey === key && this.music && this.music.isPlaying) return;

    try {
      const sm = this.scene.sound;
      // Mobile autoplay restriction: defer until the first user interaction unlocks audio.
      if (sm.locked) {
        sm.once('unlocked', () => this.playMusic(key));
        return;
      }
      // Optional track: if the file was never committed, keep whatever is playing (stay silent).
      if (!sm.get(key)) return;

      this.stopMusic();
      this.music = sm.add(key, { loop: true, volume: this.musicVolume });
      this.music.play();
      this.currentMusicKey = key;
    } catch (e) {}
  },

  stopMusic() {
    if (this.music) {
      this.music.stop();
      this.music.destroy();
      this.music = null;
      this.currentMusicKey = null;
    }
  },

  fadeMusic(duration = 600) {
    if (this.music) {
      this.scene.tweens.add({
        targets: this.music,
        volume: 0,
        duration,
        onComplete: () => this.stopMusic()
      });
    }
  },

  // === SFX ===
  playSfx(key) {
    if (!this.scene || this.muted || !key) return;

    try {
      if (this.scene.sound.get(key)) {
        this.scene.sound.play(key, { volume: this.sfxVolume });
      }
    } catch (e) {}
  },

  // === VOLUME & MUTE ===
  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.music) this.music.setVolume(this.musicVolume);
    this.saveSettings();
  },

  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    this.saveSettings();
  },

  toggleMute() {
    this.muted = !this.muted;

    if (this.muted) {
      if (this.music) this.music.pause();
    } else {
      if (this.music) this.music.resume();
    }

    this.saveSettings();
    return this.muted;
  },

  saveSettings() {
    SaveSystem.save('audioSettings', {
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      muted: this.muted
    });
  },

  setScene(scene) {
    this.scene = scene;
  }
};

window.AudioManager = AudioManager;
export default AudioManager;