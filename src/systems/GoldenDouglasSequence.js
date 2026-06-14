import { feel } from './feel.js';

export function startGoldenDouglasSequence(scene) {
  if (!scene || scene.__goldenDouglasRunning) return;
  scene.__goldenDouglasRunning = true;
  const { width: W, height: H } = scene.scale;

  const overlay = scene.add.rectangle(W/2, H/2, W, H, 0x3a2a12, 0.75).setDepth(200).setInteractive();
  feel(scene, 'golden_douglas', 'goldenDouglas');

  if (typeof RewardJuice !== 'undefined') {
    RewardJuice.confetti(scene, W/2, H/2 - 80);
  }

  const title = scene.add.text(W/2, H/2 - 140, '🌟 HUDSON FOUND\nGOLDEN DOUGLAS! 🌟', {
    fontSize: '28px', color: '#FFD23F', fontStyle: 'bold', align: 'center', depth: 202
  }).setOrigin(0.5);

  scene.add.text(W/2, H/2 - 60, 'The rarest friend in Hudson’s World has appeared.', {
    fontSize: '16px', color: '#FFE9C9', align: 'center', depth: 202
  }).setOrigin(0.5);

  const btn = scene.add.text(W/2, H/2 + 100, 'Continue', {
    fontSize: '22px', color: '#fff', backgroundColor: '#5BA838', padding: {x:24, y:10}
  }).setOrigin(0.5).setDepth(203).setInteractive({ useHandCursor: true });

  btn.on('pointerdown', () => {
    overlay.destroy(); title.destroy(); btn.destroy();
    scene.__goldenDouglasRunning = false;
  });
}
window.startGoldenDouglasSequence = startGoldenDouglasSequence;