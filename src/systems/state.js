import SaveSystem from './SaveSystem.js';
import { BUILDINGS, CRITTERS, DOUGLAS_SKINS } from '../data/collections.js';
import { dailyChallengeZone, daySeed } from './gameplay.js';

export const ZONE_IDS = ['forest', 'pirate', 'dino', 'space', 'pumpkin'];

const freshState = () => ({
  version: 8,
  stars: 0,
  bones: 0,
  xp: 0,
  level: 1,
  outfit: 'everyday',
  outfits: ['everyday'],
  zoneStars: { forest: 0, pirate: 0, dino: 0, space: 0, pumpkin: 0 },
  best: { forest: 0, pirate: 0, dino: 0, space: 0, pumpkin: 0 },
  plays: 0,
  lifetime: 0,
  journal: [],
  photos: ['family'],
  achievements: [],
  critters: ['moss-bug'],
  stickers: ['hudson-star'],
  town: { plots: [null, null, null, null, null, null], mayor: false },
  customCaptions: {},
  surprisesFound: 0,
  finleyChaosWins: 0,
  winterBest: 0,
  babyBellCount: 0,
  goldenDouglasFound: false,
  kingdomVisited: false,
  seenIntro: false,
  douglas: { joy: 60, treats: 0, pets: 0, games: 0, xp: 0, level: 1, skin: 'classic', skins: ['classic'] },
  settings: {
    sound: true, narration: true, calm: false, vibration: true, largeText: false,
    colourSafe: false, breakReminder: false, breakMinutes: 20
  },
  quests: {
    bones: { value: 0, goal: 20, claimed: false },
    adventures: { value: 0, goal: 5, claimed: false },
    friend: { value: 0, goal: 3, claimed: false }
  }
});

function mergeSaved(base, saved) {
  if (!saved || typeof saved !== 'object') return base;
  const merged = { ...base, ...saved };
  merged.zoneStars = { ...base.zoneStars, ...(saved.zoneStars || {}) };
  merged.best = { ...base.best, ...(saved.best || {}) };
  const oldDouglas = saved.douglas || saved.doug || {};
  merged.douglas = { ...base.douglas, ...oldDouglas };
  if (typeof oldDouglas.joy !== 'number' && typeof oldDouglas.mood === 'number') merged.douglas.joy = oldDouglas.mood;
  if (typeof oldDouglas.level !== 'number') merged.douglas.level = Math.min(5, 1 + Math.floor((oldDouglas.xp || 0) / 60));
  merged.settings = { ...base.settings, ...(saved.settings || {}) };
  merged.town = { ...base.town, ...(saved.town || {}) };
  merged.town.plots = Array.from({ length: 6 }, (_, i) => saved.town?.plots?.[i] || null);
  merged.customCaptions = { ...(saved.customCaptions || {}) };
  merged.quests = { ...base.quests };
  Object.keys(base.quests).forEach((key) => {
    merged.quests[key] = { ...base.quests[key], ...(saved.quests?.[key] || {}) };
  });
  merged.outfits = [...new Set(Array.isArray(saved.outfits) ? saved.outfits : base.outfits)];
  const legacyPhotoIds = ['family', 'forest', 'pirate', 'dino', 'space', 'pumpkin', 'babybell', 'kingdom', 'town'];
  const legacyPhotos = Array.isArray(saved.unlockedPhotos) ? saved.unlockedPhotos.map((index) => legacyPhotoIds[index]).filter(Boolean) : [];
  merged.photos = [...new Set(Array.isArray(saved.photos) ? saved.photos : [...base.photos, ...legacyPhotos])];
  const legacyAchievements = saved.achievements && !Array.isArray(saved.achievements)
    ? Object.entries(saved.achievements).filter(([, unlocked]) => unlocked).map(([id]) => id)
    : [];
  merged.achievements = [...new Set(Array.isArray(saved.achievements) ? saved.achievements : legacyAchievements)];
  merged.critters = [...new Set(Array.isArray(saved.critters) ? saved.critters : base.critters)];
  merged.stickers = [...new Set(Array.isArray(saved.stickers) ? saved.stickers : base.stickers)];
  const earnedSkins = DOUGLAS_SKINS.filter((skin) => skin.needLevel <= merged.douglas.level).map((skin) => skin.id);
  merged.douglas.skins = [...new Set([...(Array.isArray(merged.douglas.skins) ? merged.douglas.skins : ['classic']), ...earnedSkins])];
  merged.journal = Array.isArray(saved.journal) ? saved.journal : [];
  return merged;
}

export const S = mergeSaved(freshState(), SaveSystem.load('hudsonsWorldState', SaveSystem.load('gameState', null)));

export function persist() { SaveSystem.save('hudsonsWorldState', S); }

export function resetProgress() {
  Object.keys(S).forEach((key) => delete S[key]);
  Object.assign(S, freshState());
  persist();
}

export const xpNeed = (level = S.level) => 80 + Math.max(0, level - 1) * 35;

export const TITLES = [
  'Junior Explorer', 'Bone Collector', 'Treasure Spotter', 'Dino Friend',
  'Star Cadet', 'Pumpkin Champion', 'Adventure Captain', 'Kingdom Helper',
  'Deputy Mayor', 'MAYOR OF HUDSON TOWN'
];

export function titleForLevel(level = S.level) {
  if (S.town?.mayor) return 'MAYOR OF HUDSON TOWN';
  return TITLES[Math.min(TITLES.length - 1, Math.max(0, level - 1))];
}

export function addJournal(id, icon, title, text) {
  if (S.journal.some((entry) => entry.id === id)) return false;
  S.journal.unshift({ id, icon, title, text, date: Date.now() });
  S.journal = S.journal.slice(0, 40);
  persist();
  return true;
}

export function addPhoto(id) { if (!S.photos.includes(id)) S.photos.push(id); }

export function addAchievement(id) {
  if (S.achievements.includes(id)) return false;
  S.achievements.push(id);
  return true;
}

export function addOutfit(id) { if (!S.outfits.includes(id)) S.outfits.push(id); }
export function addSticker(id) { if (!S.stickers.includes(id)) { S.stickers.push(id); return true; } return false; }
export function addCritter(id) { if (!S.critters.includes(id)) { S.critters.push(id); return true; } return false; }

export function unlockNextCritter(home) {
  const next = CRITTERS.find((critter) => (!home || critter.home === home) && !S.critters.includes(critter.id));
  if (!next) return null;
  addCritter(next.id);
  return next;
}

export function addXp(amount) {
  S.xp += Math.max(0, amount);
  let levels = 0;
  while (S.level < 10 && S.xp >= xpNeed(S.level)) {
    S.xp -= xpNeed(S.level);
    S.level += 1;
    levels += 1;
  }
  return levels;
}

export function campaignBadges() { return ZONE_IDS.filter((id) => (S.zoneStars[id] || 0) > 0).length; }
export function totalZoneStars() { return ZONE_IDS.reduce((sum, id) => sum + (S.zoneStars[id] || 0), 0); }
export function kingdomUnlocked() { return campaignBadges() === ZONE_IDS.length; }
export function photosUnlocked() { return S.photos.length; }

export function townProgress() { return S.town.plots.filter(Boolean).length; }

export function buildTownPlot(index, buildingId) {
  if (index < 0 || index >= 6 || !BUILDINGS.some((building) => building.id === buildingId)) return false;
  const usedElsewhere = S.town.plots.some((id, plot) => id === buildingId && plot !== index);
  if (usedElsewhere) return false;
  S.town.plots[index] = buildingId;
  addSticker('town-builder');
  if (townProgress() === 6 && !S.town.mayor) {
    S.town.mayor = true;
    addAchievement('mayor-hudson'); addSticker('mayor-hudson'); addOutfit('mayor'); addPhoto('town');
    addJournal('mayor-hudson', '🎖️', 'Mayor of Hudson Town!', 'Hudson built six brilliant places and became Mayor of the whole town.');
  }
  persist();
  return true;
}

export function addDouglasXp(amount) {
  S.douglas.xp += Math.max(0, amount);
  const previous = S.douglas.level;
  S.douglas.level = Math.min(5, 1 + Math.floor(S.douglas.xp / 60));
  DOUGLAS_SKINS.filter((skin) => skin.needLevel <= S.douglas.level).forEach((skin) => {
    if (!S.douglas.skins.includes(skin.id)) S.douglas.skins.push(skin.id);
  });
  if (S.douglas.level === 5) addAchievement('legendary-friend');
  return S.douglas.level > previous;
}

export function progressQuest(id, amount = 1) {
  const q = S.quests[id];
  if (!q || q.claimed) return;
  q.value = Math.min(q.goal, q.value + Math.max(0, amount));
}

export function claimQuest(id) {
  const q = S.quests[id];
  if (!q || q.claimed || q.value < q.goal) return false;
  q.claimed = true;
  S.stars += 2;
  addXp(30);
  addAchievement(`quest-${id}`);
  addJournal(`quest-${id}`, '✅', 'Quest Complete!', 'Hudson finished a family quest and earned two bonus stars.');
  persist();
  return true;
}

export function todaysChallengeZone() { return dailyChallengeZone(daySeed(), ZONE_IDS); }

export function recordAdventure(zoneId, score, stars, extras = {}) {
  if (!ZONE_IDS.includes(zoneId)) return { newBest: false, newStars: 0, levelUps: 0, firstBadge: false, dailyChallenge: false };
  const previousStars = S.zoneStars[zoneId] || 0;
  const previousBest = S.best[zoneId] || 0;
  const earned = Math.max(1, Math.min(3, stars));
  const newStars = Math.max(0, earned - previousStars);
  const firstBadge = previousStars === 0;
  const dailyChallenge = newStars > 0 && zoneId === todaysChallengeZone();
  const bonusStars = dailyChallenge ? newStars : 0;

  S.zoneStars[zoneId] = Math.max(previousStars, earned);
  S.best[zoneId] = Math.max(previousBest, Math.round(score));
  S.stars += newStars + bonusStars;
  S.bones += extras.bones || 0;
  S.plays += 1;
  S.lifetime += Math.max(0, Math.round(score));
  const levelUps = addXp(20 + earned * 15);
  progressQuest('bones', extras.bones || 0);
  if (firstBadge) progressQuest('adventures', 1);

  const rewards = {
    forest: ['forest', 'ranger'], pirate: ['pirate', 'captain'], dino: ['dino', 'dino'],
    space: ['space', 'astronaut'], pumpkin: ['pumpkin', 'pumpkin']
  };
  const [photo, outfit] = rewards[zoneId];
  const homes = { forest: 'Douglas Forest', pirate: 'Pirate Island', dino: 'Dino Valley', space: 'Space Station', pumpkin: 'Pumpkin Patch' };
  const critter = unlockNextCritter(homes[zoneId]);
  addDouglasXp(10 + earned * 4 + Math.min(10, extras.bones || 0));
  if (firstBadge) {
    addPhoto(photo); addOutfit(outfit);
    addSticker(`${zoneId}-badge`);
    addJournal(`zone-${zoneId}`, extras.icon || '⭐', extras.title || 'A New Adventure', extras.journal || 'Hudson and Douglas made a brilliant new memory together.');
  }
  if (campaignBadges() === 5) {
    addAchievement('all-zones'); addPhoto('kingdom');
    addJournal('kingdom-open', '🏰', 'The Kingdom Gates Opened', 'Five adventure badges lit up the path to Hudson Kingdom!');
  }
  if (totalZoneStars() === 15) addAchievement('perfect-adventurer');
  persist();
  return { newBest: score > previousBest, newStars, levelUps, firstBadge, critter, dailyChallenge };
}

export function careForDouglas(action) {
  const gains = { pet: 8, treat: 10, play: 12 };
  const key = { pet: 'pets', treat: 'treats', play: 'games' }[action];
  if (!key) return;
  S.douglas[key] += 1;
  S.douglas.joy = Math.min(100, S.douglas.joy + gains[action]);
  addDouglasXp(action === 'play' ? 10 : 7);
  if (action === 'treat') addSticker('douglas-bone');
  progressQuest('friend', 1);
  if (S.douglas.joy >= 100) addAchievement('best-friends');
  persist();
}

export default S;
