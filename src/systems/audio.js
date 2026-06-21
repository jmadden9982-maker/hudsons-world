import AudioManager from './AudioManager.js';

export const SFX = {
  tap() {
    try {
      if (window.AudioManager && typeof window.AudioManager.playSfx === 'function') {
        window.AudioManager.playSfx('button_click');
      } else if (typeof AudioManager !== 'undefined' && AudioManager.playSfx) {
        AudioManager.playSfx('button_click');
      }
    } catch (e) {}
  },
  coin() {
    try { if (window.AudioManager) window.AudioManager.playSfx('coin_pickup'); } catch (e) {}
  },
  bone() {
    try { if (window.AudioManager) window.AudioManager.playSfx('bone_pickup'); } catch (e) {}
  },
  jump() {
    try { if (window.AudioManager) window.AudioManager.playSfx('button_confirm'); } catch (e) {}
  },
  good() {
    try { if (window.AudioManager) window.AudioManager.playSfx('reward'); } catch (e) {}
  },
  bad() {
    try { if (window.AudioManager) window.AudioManager.playSfx('error'); } catch (e) {}
  },
  win() {
    try { if (window.AudioManager) window.AudioManager.playSfx('achievement'); } catch (e) {}
  }
};

export function unlockAudio() {
  try {
    if (window.AudioManager && typeof window.AudioManager.unlock === 'function') {
      window.AudioManager.unlock();
    }
  } catch (e) {}
}

export { AudioManager };