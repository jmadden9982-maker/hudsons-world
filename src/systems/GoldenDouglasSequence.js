import AudioManager from './AudioManager.js';

export function startGoldenDouglasSequence(scene, options = {}) {
  const isReplay = options.isReplay || false;

  // Prevent double-triggering
  if (scene.__goldenDouglasRunning) return;
  scene.__goldenDouglasRunning = true;

  const { width, height } = scene.scale;

  // 1. Screen dim + golden shimmer
  const overlay = scene.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);
  AudioManager.playSfx('golden_shimmer');

  // 2. Legendary chime as statue awakens
  scene.time.delayedCall(350, () => {
    AudioManager.playSfx('legendary_chime');
  });

  // 3. Sparkle swell during particle burst
  scene.time.delayedCall(700, () => {
    AudioManager.playSfx('sparkle_swell');

    scene.add.particles(width / 2, height / 2 - 50, 'particle_sparkle', {
      speed: { min: 60, max: 160 },
      scale: { start: 0.7, end: 0 },
      lifespan: 900
    }).explode(20);

    if (!isReplay) {
      scene.add.particles(width / 2, height / 2 - 50, 'particle_confetti', {
        speed: { min: 70, max: 180 },
        scale: { start: 0.6, end: 0 },
        lifespan: 1100
      }).explode(14);
    }
  });

  // 4. Achievement fanfare when big text appears
  scene.time.delayedCall(1200, () => {
    AudioManager.playSfx('achievement_fanfare');

    const title = scene.add.text(width / 2, height / 2 - 80, '🌟 HUDSON FOUND GOLDEN DOUGLAS! 🌟', {
      fontSize: '26px',
      color: '#FFD700',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 300,
      yoyo: true
    });
  });

  // 5. Reward confirmation
  scene.time.delayedCall(2000, () => {
    AudioManager.playSfx('reward_reveal');

    const subtitle = scene.add.text(width / 2, height / 2 + 20, 'The rarest friend in Hudson’s World has appeared.', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Auto cleanup and buttons
    scene.time.delayedCall(2800, () => {
      overlay.destroy();
      title?.destroy();
      subtitle?.destroy();
      scene.__goldenDouglasRunning = false;

      // Show buttons (Continue, Journal, Trophy Room)
      // This part can be expanded later
    });
  });
}

export default startGoldenDouglasSequence;