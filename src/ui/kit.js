export function sceneBg(scene, key, top, bot) {
  const { width:W, height:H } = scene.scale;
  if (scene.textures.exists(key)) {
    const img = scene.add.image(W/2, H/2, key);
    const sc = Math.max(W/img.width, H/img.height); 
    img.setScale(sc);
    return img;
  }
  return bg(scene, top, bot);
}

export function header(scene, title) {
  const { width:W } = scene.scale;
  scene.add.text(W/2, 30, title, { 
    fontFamily:FONT, fontSize:'30px', color:'#7a4a00', fontStyle:'bold' 
  }).setOrigin(0.5).setShadow(0,2,'#ffffff88',2);
}