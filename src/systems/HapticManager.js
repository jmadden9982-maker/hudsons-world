// HapticManager.js — V6.0 Haptics
let enabled = true;

export const HapticManager = {
  isEnabled() { return enabled; },
  vibrate(pattern) {
    if (!this.isEnabled()) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  },
  tap() { this.vibrate(10); },
  soft() { this.vibrate(8); },
  success() { this.vibrate([20, 40, 20]); },
  reward() { this.vibrate([30, 40, 30]); },
  achievement() { this.vibrate([40, 50, 40, 50, 60]); },
  goldenDouglas() { this.vibrate([60, 80, 60, 80, 100]); },
  error() { this.vibrate(30); }
};
window.HapticManager = HapticManager;