// Pure helpers for CharacterActor, kept free of any Phaser/DOM import so they can
// be unit tested directly under Node (Phaser itself throws outside a browser).

export function animKey(artKey, state) {
  return `${artKey}-${state}`;
}

export function facingScale(baseScale, direction) {
  const magnitude = Math.abs(baseScale || 1);
  return direction < 0 ? -magnitude : magnitude;
}
