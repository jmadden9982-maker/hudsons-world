export function addPremiumHud(scene) {
  // Minimal compatibility stub
  if (!scene) return null;

  const d = scene.add.container(0, 0).setDepth(40);

  // Try to use painted HUD frame if available
  if (scene.textures.exists('ui_hud_frame')) {
    const frame = scene.add.image(scene.scale.width / 2, 23, 'ui_hud_frame').setScale(0.95);
    d.add(frame);
  }

  return d;
}