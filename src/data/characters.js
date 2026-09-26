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

// Real illustrated art slots, keyed by the same character id. Empty until a real
// spritesheet is dropped into public/assets/characters/<key>.png and preloaded
// under the `texture` key below with its frame size. Once that texture exists in
// a scene, CharacterActor automatically switches from the emoji fallback to a
// real animated sprite with no gameplay code changes required.
//
// Example entry once art + frame layout is supplied:
// douglas: { texture: 'char-douglas', frameWidth: 128, frameHeight: 128, states: {
//   idle:      { start: 0,  end: 3,  frameRate: 6,  repeat: -1 },
//   walk:      { start: 4,  end: 9,  frameRate: 12, repeat: -1 },
//   celebrate: { start: 10, end: 15, frameRate: 14, repeat: 0 },
//   hurt:      { start: 16, end: 17, frameRate: 10, repeat: 0 }
// } }
export const CHARACTER_ART = {};

export function getCharacter(id) {
  return CHARACTERS[id] || null;
}

export function getCharacterArt(id) {
  return CHARACTER_ART[id] || null;
}

export function hasRegisteredArt(id) {
  return Boolean(CHARACTER_ART[id]);
}
