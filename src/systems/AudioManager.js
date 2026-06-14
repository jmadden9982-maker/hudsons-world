const AudioManager = {
  scene: null,
  music: null,
  currentMusicKey: null,

  musicVolume: 0.7,
  sfxVolume: 0.85,
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

    this.stopMusic();

    try {
      if (this.scene.sound.get(key)) {
        this.music = this.scene.sound.add(key, {
          loop: true,
          volume: this.musicVolume
        });
        this.music.play();
        this.currentMusicKey = key;
      }
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