import { S } from './state.js';

const Narrator = {
  speak(text) {
    if (!S.settings.narration || !text || !('speechSynthesis' in window)) return false;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(String(text).replace(/[⭐🏅✨🦴🐶🏴‍☠️🦖🚀🎃🏰]/gu, ''));
      utterance.rate = S.settings.calm ? 0.82 : 0.92;
      utterance.pitch = 1.08;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch { return false; }
  },
  stop() { try { window.speechSynthesis?.cancel(); } catch { /* optional browser feature */ } },
  attach(scene) { scene.events.once('shutdown', () => this.stop()); }
};

export default Narrator;
