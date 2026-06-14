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

export { sceneBg };