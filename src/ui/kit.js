export function addBackButton(scene, targetScene = 'WorldMapScene') {
  const { width: W, height: H } = scene.scale;

  const btnW = 140;
  const btnH = 56;
  const x = 30 + btnW / 2;
  const y = H - 45;

  const c = scene.add.container(x, y).setDepth(100);

  const bg = scene.add.graphics();
  bg.fillStyle(0x5E3A1C, 1);
  bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 16);
  bg.lineStyle(3, 0xB07B4F, 1);
  bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 16);

  const label = scene.add.text(0, 0, '⬅️ Map', {
    fontFamily: FONT,
    fontSize: '20px',
    color: '#FFE9C9',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  c.add([bg, label]);
  c.setSize(btnW, btnH).setInteractive({ useHandCursor: true });

  c.on('pointerdown', () => {
    try {
      if (typeof SFX !== 'undefined' && SFX.tap) SFX.tap();
      else if (window.AudioManager) window.AudioManager.playSfx('button_click');
    } catch (e) {}

    scene.scene.start(targetScene);
  });

  return c;
}

export function backButton(scene, onTap) {
  return addBackButton(scene, 'WorldMapScene');
}