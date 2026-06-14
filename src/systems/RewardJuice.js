// RewardJuice.js
export const RewardJuice = {
  burst(scene, x, y, textureKey, count = 8) {
    if (!scene) return;
    if (scene.textures && scene.textures.exists(textureKey)) {
      const emitter = scene.add.particles(x, y, textureKey, {
        speed: { min: 50, max: 90 },
        scale: { start: 0.6, end: 0 },
        lifespan: 600
      });
      emitter.explode(count);
      scene.time.delayedCall(700, () => emitter.destroy());
    }
  },
  coinBurst(scene, x, y) { this.burst(scene, x, y, 'particle_sparkle', 6); },
  starBurst(scene, x, y) { this.burst(scene, x, y, 'particle_star', 5); },
  sparkle(scene, x, y) { this.burst(scene, x, y, 'particle_sparkle', 4); },
  confetti(scene, x, y) { this.burst(scene, x, y, 'particle_confetti', 10); }
};
window.RewardJuice = RewardJuice;