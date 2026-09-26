// Central character registry. Every scene should create character actors through
// CharacterActor (src/systems/CharacterActor.js) using an id from here instead of
// hand-writing an emoji text object, so a single art drop upgrades every scene.

export const CHARACTERS = {
  hudson: { id: 'hudson', name: 'Hudson', emoji: '👦', color: 0x47a8e8 },
  douglas: { id: 'douglas', name: 'Douglas', emoji: '🐶', color: 0x9b683d },
  finley: { id: 'finley', name: 'Finley', emoji: '🧒', color: 0xe76586 },
  babybell: { id: 'babybell', name: 'Baby Bell', emoji: '🐱', color: 0x8b63c7 },
  aimee: { id: 'aimee', name: 'Aimee', emoji: '👩', color: 0xf36f5f },
  james: { id: 'james', name: 'James', emoji: '👨', color: 0x4f77bb }
};

// Real illustrated art, keyed by the same character id. Each spritesheet is a
// 1536x1024 transparent PNG in public/assets/characters/<key>.png, laid out as a
// 6-column x 4-row grid of 256x256 frames (idle/walk/celebrate/hurt, in that row
// order, padded with blank cells where a row has fewer than 6 poses). Preloaded
// as spritesheets in PreloadScene. Once the texture exists in a scene,
// CharacterActor automatically switches from the emoji fallback to the real
// animated sprite with no gameplay code changes required.
const FRAME = { frameWidth: 256, frameHeight: 256 };
const STANDARD_STATES = {
  idle: { start: 0, end: 3, frameRate: 6, repeat: -1 },
  walk: { start: 6, end: 11, frameRate: 12, repeat: -1 },
  celebrate: { start: 12, end: 17, frameRate: 14, repeat: 0 },
  hurt: { start: 18, end: 19, frameRate: 10, repeat: 0 }
};

export const CHARACTER_ART = {
  hudson: { texture: 'char-hudson', ...FRAME, states: STANDARD_STATES },
  douglas: { texture: 'char-douglas', ...FRAME, states: STANDARD_STATES },
  finley: { texture: 'char-finley', ...FRAME, states: STANDARD_STATES },
  babybell: { texture: 'char-babybell', ...FRAME, states: STANDARD_STATES },
  aimee: { texture: 'char-aimee', ...FRAME, states: STANDARD_STATES },
  james: { texture: 'char-james', ...FRAME, states: STANDARD_STATES }
};

export function getCharacter(id) {
  return CHARACTERS[id] || null;
}

export function getCharacterArt(id) {
  return CHARACTER_ART[id] || null;
}

export function hasRegisteredArt(id) {
  return Boolean(CHARACTER_ART[id]);
}
