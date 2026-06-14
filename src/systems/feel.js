export function feel(scene, sfxKey = null, hapticType = 'tap') {
  try {
    if (window.AudioManager && sfxKey) {
      window.AudioManager.setScene?.(scene);
      window.AudioManager.playSfx?.(sfxKey);
    }
  } catch (e) {}
  try {
    if (window.HapticManager && hapticType && window.HapticManager[hapticType]) {
      window.HapticManager[hapticType]();
    }
  } catch (e) {}
}