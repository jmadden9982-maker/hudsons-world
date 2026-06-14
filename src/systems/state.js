import SaveSystem from './SaveSystem.js';

export const S = {
  coins: 0,
  stars: 0,
  xp: 0,
  level: 1,
  cards: [],
  outfits: ['everyday'],
  outfit: 'everyday',
  stickers: [],
  journal: [],
  journalKeys: [],
  best: { dash: 0, space: 0, pumpkin: 0 },
  doug: { xp: 0, mood: 80, skin: 'classic', skins: ['classic'] },
  kingdom: false,
  plays: 0,
  lifetime: 0,
  dailyRewardLastClaimed: null,
  babyBellCount: 0,
  goldenDouglasFound: false,
  journalFavourites: [],
  settings: { sound: true, music: true, calm: false, vibration: true },
  _v: 1
};

try {
  if (SaveSystem && typeof SaveSystem.load === 'function') {
    const saved = SaveSystem.load('gameState', null);
    if (saved && typeof saved === 'object') {
      Object.assign(S, saved);
    }
  }
} catch (e) {}

export function persist() {
  try {
    if (SaveSystem && typeof SaveSystem.save === 'function') {
      SaveSystem.save('gameState', S);
    }
  } catch (e) {}
}

export const TITLES = [
  'Junior Explorer', 'Bone Collector', 'Treasure Spotter', 'Dino Friend',
  'Star Cadet', 'Pumpkin Champion', 'Town Planner', 'Adventure Captain',
  'Deputy Mayor', 'MAYOR OF HUDSON TOWN'
];

export const xpNeed = (lvl) => (lvl || 1) * 100;