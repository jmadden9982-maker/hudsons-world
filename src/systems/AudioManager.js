import { S } from './state.js';

const THEMES = {
  DouglasDashScene: { notes: [261.63, 329.63, 392, 523.25, 392, 329.63], wave: 'triangle', tempo: 255 },
  PirateDigScene: { notes: [220, 293.66, 329.63, 440, 329.63, 293.66], wave: 'triangle', tempo: 330 },
  DinoRescueScene: { notes: [196, 246.94, 293.66, 392, 293.66, 246.94], wave: 'sine', tempo: 390 },
  SpaceRescueScene: { notes: [174.61, 261.63, 349.23, 523.25, 349.23, 261.63], wave: 'sine', tempo: 310 },
  PumpkinSmashScene: { notes: [220, 277.18, 329.63, 415.3, 329.63, 277.18], wave: 'triangle', tempo: 285 },
  WinterVillageScene: { notes: [261.63, 329.63, 392, 659.25, 523.25, 392], wave: 'sine', tempo: 430 },
  FinleyChaosScene: { notes: [293.66, 349.23, 440, 587.33, 440, 349.23], wave: 'triangle', tempo: 345 },
  HudsonKingdomScene: { notes: [261.63, 392, 523.25, 659.25, 783.99, 659.25], wave: 'triangle', tempo: 360 },
  MainMenuScene: { notes: [261.63, 329.63, 392, 523.25, 493.88, 392], wave: 'sine', tempo: 440 },
  WorldMapScene: { notes: [261.63, 392, 440, 523.25, 440, 392], wave: 'sine', tempo: 400 }
};

const EFFECTS = {
  button_click: [{ f: 420, d: 0.055, v: 0.055 }],
  button_confirm: [{ f: 520, d: 0.07, v: 0.06 }, { f: 780, d: 0.11, v: 0.05, delay: 0.045 }],
  bone_collect: [{ f: 740, d: 0.08, v: 0.07 }, { f: 1110, d: 0.12, v: 0.05, delay: 0.05 }],
  reward: [{ f: 523.25, d: 0.12, v: 0.065 }, { f: 659.25, d: 0.14, v: 0.06, delay: 0.07 }, { f: 783.99, d: 0.18, v: 0.055, delay: 0.14 }],
  success: [{ f: 659.25, d: 0.12, v: 0.06 }, { f: 987.77, d: 0.18, v: 0.05, delay: 0.07 }],
  bump: [{ f: 150, d: 0.12, v: 0.07, wave: 'square', drop: true }],
  douglas_happy: [{ f: 540, d: 0.08, v: 0.055 }, { f: 680, d: 0.08, v: 0.05, delay: 0.08 }, { f: 820, d: 0.12, v: 0.045, delay: 0.16 }]
};

const AudioManager = {
  scene: null,
  context: null,
  master: null,
  musicBus: null,
  musicTimer: null,
  musicStep: 0,
  theme: THEMES.MainMenuScene,

  setScene(scene) {
    this.scene = scene;
    this.theme = THEMES[scene?.scene?.key] || THEMES.WorldMapScene;
    this.musicStep = 0;
    if (this.context && this.context.state === 'running') this.startMusic();
  },

  ensureContext() {
    if (this.context) return this.context;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    this.context = new Context();
    this.master = this.context.createGain();
    this.musicBus = this.context.createGain();
    this.master.gain.value = 0.72;
    this.musicBus.gain.value = 0.18;
    this.musicBus.connect(this.master);
    this.master.connect(this.context.destination);
    return this.context;
  },

  unlock() {
    const context = this.ensureContext();
    if (!context) return;
    if (context.state === 'suspended') context.resume().then(() => this.startMusic()).catch(() => {});
    else if (!this.musicTimer) this.startMusic();
  },

  tone(frequency, duration, volume, options = {}) {
    const context = this.ensureContext();
    if (!context || !S.settings.sound) return;
    const start = context.currentTime + (options.delay || 0);
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = options.wave || 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    if (options.drop) oscillator.frequency.exponentialRampToValueAtTime(Math.max(50, frequency * 0.45), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(options.bus || this.master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.025);
  },

  playSfx(key = 'button_click') {
    if (!S.settings.sound) return;
    try {
      this.unlock();
      (EFFECTS[key] || EFFECTS.button_click).forEach((note) => this.tone(note.f, note.d, note.v, note));
    } catch { /* Audio remains an optional enhancement. */ }
  },

  musicTick() {
    if (!S.settings.sound || !this.context || this.context.state !== 'running') return;
    const theme = this.theme || THEMES.MainMenuScene;
    const note = theme.notes[this.musicStep % theme.notes.length];
    this.tone(note, 0.5, 0.032, { wave: theme.wave, bus: this.musicBus });
    if (this.musicStep % 2 === 0) this.tone(note / 2, 0.72, 0.022, { wave: 'sine', bus: this.musicBus });
    if (this.musicStep % 6 === 0) this.tone(note * 1.5, 0.3, 0.012, { wave: 'triangle', delay: 0.12, bus: this.musicBus });
    this.musicStep += 1;
  },

  startMusic() {
    this.stopMusic();
    if (!S.settings.sound || !this.context) return;
    this.musicTick();
    this.musicTimer = window.setInterval(() => this.musicTick(), this.theme?.tempo || 400);
  },

  stopMusic() {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  },

  fadeMusic() {
    if (!this.musicBus || !this.context) return;
    const now = this.context.currentTime;
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, now);
    this.musicBus.gain.linearRampToValueAtTime(0.001, now + 0.35);
  }
};

window.AudioManager = AudioManager;

export default AudioManager;
export { AudioManager };
