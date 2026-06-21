import AudioManager from './AudioManager.js';

export function startGoldenDouglasSequence(scene, options = {}) {
  const isReplay = options.isReplay || false;

  // Prevent double-triggering
  if (scene.__goldenDouglasRunning) return;
  scene.__goldenDouglasRunning = true;

  const { width, height } = scene.scale;

  // Track everything we create so it can be torn down cleanly (no leaked
  // emitters / orphaned text across replays or scene shutdown).
  const created = [];
  const emitters = [];
  const timers = [];

  const overlay = scene.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);
  created.push(overlay);
  AudioManager.playSfx('golden_shimmer');

  timers.push(scene.time.delayedCall(350, () => AudioManager.playSfx('legendary_chime')));

  timers.push(scene.time.delayedCall(700, () => {
    AudioManager.playSfx('sparkle_swell');
    // Guard particle textures: add.particles throws if the key is missing.
    if (scene.textures.exists('particle_sparkle')) {
      const e = scene.add.particles(width / 2, height / 2 - 50, 'particle_sparkle', {
        speed: { min: 60, max: 160 }, scale: { start: 0.7, end: 0 }, lifespan: 900
      });
      e.explode(20); emitters.push(e);
    }
    if (!isReplay && scene.textures.exists('particle_confetti')) {
      const e = scene.add.particles(width / 2, height / 2 - 50, 'particle_confetti', {
        speed: { min: 70, max: 180 }, scale: { start: 0.6, end: 0 }, lifespan: 1100
      });
      e.explode(14); emitters.push(e);
    }
  }));

  timers.push(scene.time.delayedCall(1200, () => {
    AudioManager.playSfx('achievement_fanfare');
    const title = scene.add.text(width / 2, height / 2 - 80, '🌟 HUDSON FOUND GOLDEN DOUGLAS! 🌟', {
      fontSize: '26px', color: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5);
    created.push(title);
    scene.tweens.add({ targets: title, scale: 1.05, duration: 300, yoyo: true });
  }));

  timers.push(scene.time.delayedCall(2000, () => {
    AudioManager.playSfx('reward_reveal');
    const subtitle = scene.add.text(width / 2, height / 2 + 20, 'The rarest friend in Hudson’s World has appeared.', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5);
    created.push(subtitle);

    timers.push(scene.time.delayedCall(2800, () => {
      created.forEach(o => { try { o.destroy(); } catch (e) {} });
      emitters.forEach(e => { try { e.destroy(); } catch (e2) {} });
      scene.__goldenDouglasRunning = false;
    }));
  }));

  // Safety: if the scene shuts down mid-sequence, cancel timers and reset the flag.
  scene.events.once('shutdown', () => {
    timers.forEach(t => { try { t.remove(); } catch (e) {} });
    emitters.forEach(e => { try { e.destroy(); } catch (e) {} });
    scene.__goldenDouglasRunning = false;
  });
}

export default startGoldenDouglasSequence;
