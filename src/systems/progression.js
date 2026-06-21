// Phase 10F — progression & rewards.
// Central, save-safe helpers for journal entries, photo unlocks, achievements and
// star/XP rewards. Everything is guarded and never throws; all writes go through the
// shared `S` blob + persist() so the HUD stays consistent.
import { S, persist, xpNeed } from './state.js';
import { toast, refreshHUD } from '../ui/kit.js';
import AudioManager from './AudioManager.js';

export const PHOTO_TOTAL = 11;

export const ACHIEVEMENTS = [
  { id: 'first_adventure', icon: '🏆', name: 'First Adventure', desc: "Enter Hudson's World" },
  { id: 'best_friend',     icon: '🐾', name: 'Best Friend',     desc: 'Pet Douglas 10 times' },
  { id: 'fashion_star',    icon: '✨', name: 'Fashion Star',    desc: 'Try 3 different outfits' },
  { id: 'treasure_hunter', icon: '💰', name: 'Treasure Hunter', desc: 'Claim the daily chest 5 times' },
  { id: 'speedy_paws',     icon: '⚡', name: 'Speedy Paws',     desc: 'Score 50 in Douglas Dash' },
  { id: 'memory_keeper',   icon: '📸', name: 'Memory Keeper',   desc: 'Unlock 5 photos' }
];

// Make sure progression fields exist even on a save made before Phase 10F.
function ensure() {
  if (!S.achievements || typeof S.achievements !== 'object') S.achievements = {};
  if (!Array.isArray(S.unlockedPhotos)) S.unlockedPhotos = [];
  if (!Array.isArray(S.outfitsTried)) S.outfitsTried = [];
  if (!S.dashMilestones || typeof S.dashMilestones !== 'object') S.dashMilestones = {};
  if (!Array.isArray(S.journal)) S.journal = [];
  if (!Array.isArray(S.journalKeys)) S.journalKeys = [];
  if (typeof S.petCount !== 'number') S.petCount = 0;
  if (typeof S.chestClaims !== 'number') S.chestClaims = 0;
}

function sfx(key) { try { AudioManager.playSfx(key); } catch (e) {} }
function say(scene, msg) { try { if (scene && msg) toast(scene, msg); } catch (e) {} }

// ---- Journal ----------------------------------------------------------------
export function addJournal(key, ic, title, text) {
  ensure();
  if (S.journalKeys.includes(key)) return false;
  S.journalKeys.push(key);
  S.journal.unshift({ ic, title, text }); // newest first
  return true;
}

// ---- Photos -----------------------------------------------------------------
export function unlockPhoto(i) {
  ensure();
  if (i < 0 || i >= PHOTO_TOTAL) return false;
  if (S.unlockedPhotos.includes(i)) return false;
  S.unlockedPhotos.push(i);
  return true;
}

export function photoUnlocked(i, total = PHOTO_TOTAL) {
  ensure();
  const bonus = i === total - 1;
  if (bonus) return !!S.kingdom || S.unlockedPhotos.includes(i);
  return S.unlockedPhotos.includes(i) || S.level >= i + 1;
}

export function countUnlockedPhotos(total = PHOTO_TOTAL) {
  let n = 0;
  for (let i = 0; i < total; i++) if (photoUnlocked(i, total)) n++;
  return n;
}

// ---- Rewards ----------------------------------------------------------------
export function grantReward(scene, stars = 0, xp = 0, label = '') {
  ensure();
  if (stars) S.stars = (S.stars || 0) + stars;
  let leveled = false;
  if (xp) {
    S.xp = (S.xp || 0) + xp;
    while (S.xp >= xpNeed(S.level)) { S.xp -= xpNeed(S.level); S.level += 1; leveled = true; }
  }
  persist();
  refreshHUD(scene); // live HUD update where a HUD exists (no-op elsewhere)
  sfx('reward');
  if (label) {
    const bits = [];
    if (stars) bits.push('+' + stars + '⭐');
    if (xp) bits.push('+' + xp + ' XP');
    say(scene, label + (bits.length ? '  ' + bits.join('  ') : ''));
  }
  if (leveled) { sfx('achievement'); say(scene, '⭐ Level ' + S.level + '!'); }
  return leveled;
}

// ---- Achievements -----------------------------------------------------------
export function award(scene, id) {
  ensure();
  if (S.achievements[id]) return false;
  S.achievements[id] = true;
  persist();
  const a = ACHIEVEMENTS.find(x => x.id === id);
  sfx('achievement');
  if (a) say(scene, '🏆 ' + a.name + ' unlocked!');
  return true;
}

export function hasAchievement(id) { ensure(); return !!S.achievements[id]; }

function checkMemoryKeeper(scene) {
  if (countUnlockedPhotos() >= 5) award(scene, 'memory_keeper');
}

// ---- Event hooks (called from scenes) --------------------------------------

// First time the player reaches the main menu: seed the journal so it's never empty.
export function onFirstLaunch(scene) {
  ensure();
  if (S.hasLaunched) return;
  S.hasLaunched = true;
  addJournal('start_world',   '🌟', 'A New World',  'Today Hudson entered his world for the first time.');
  addJournal('start_douglas', '🐶', 'Best Pal',     'Douglas wagged his tail happily.');
  addJournal('start_chest',   '🎁', 'Treasure!',    'A shiny treasure chest appeared in the house.');
  addJournal('start_outfit',  '👕', 'Dress Up',     'Hudson got ready for a big adventure.');
  unlockPhoto(0); // Photo 1 available immediately
  persist();
  award(scene, 'first_adventure');
}

export function onChestClaim(scene) {
  ensure();
  S.chestClaims += 1;
  const first = S.chestClaims === 1;
  if (first) {
    addJournal('first_chest', '🎁', 'Treasure Found', 'Hudson opened the daily chest and found shiny stars!');
    unlockPhoto(1); // Photo 2 after first chest
  }
  grantReward(scene, 0, 20, first ? 'Daily Chest!' : '');
  if (S.chestClaims >= 5) award(scene, 'treasure_hunter');
  checkMemoryKeeper(scene);
  persist();
}

export function onPetDouglas(scene) {
  ensure();
  S.petCount += 1;
  const first = S.petCount === 1;
  if (first) {
    addJournal('first_pet', '🐶', 'Good Boy', 'Douglas wagged his tail when Hudson petted him.');
    unlockPhoto(2); // Photo 3 after first Douglas interaction
  }
  grantReward(scene, 2, 10, first ? 'Douglas loves you!' : '');
  if (S.petCount >= 10) award(scene, 'best_friend');
  checkMemoryKeeper(scene);
  persist();
}

export function onTreatDouglas(scene) {
  ensure();
  const first = !S.gaveTreat;
  S.gaveTreat = true;
  if (first) {
    addJournal('first_treat', '🦴', 'Yummy Treat', 'Hudson gave Douglas a tasty treat.');
    unlockPhoto(2); // counts as a Douglas interaction
  }
  grantReward(scene, 3, 10, first ? 'Yummy!' : '');
  checkMemoryKeeper(scene);
  persist();
}

export function onOutfitEquip(scene, outfitId) {
  ensure();
  if (S.outfitsTried.includes(outfitId)) return; // re-equipping the same outfit gives no reward
  S.outfitsTried.push(outfitId);
  if (S.outfitsTried.length === 1) {
    addJournal('first_outfit', '👕', 'Dress Up', 'Hudson tried on a brand new outfit!');
  }
  grantReward(scene, 2, 8, 'New Look!');
  if (S.outfitsTried.length >= 3) award(scene, 'fashion_star');
  persist();
}

export function onDashStart(scene) {
  ensure();
  if (S.playedDash) return;
  S.playedDash = true;
  addJournal('first_dash', '🏃', 'Douglas Dash', 'Hudson and Douglas went on a running adventure!');
  unlockPhoto(3); // Photo 4 after first Dash game
  persist();
  checkMemoryKeeper(scene);
}

export function onDashEnd(scene, score) {
  ensure();
  if (score >= 10 && !S.dashMilestones.m10) {
    S.dashMilestones.m10 = true;
    grantReward(scene, 5, 10, 'Great run!');
  }
  if (score >= 25 && !S.dashMilestones.m25) {
    S.dashMilestones.m25 = true;
    unlockPhoto(4);
    addJournal('dash25', '📸', 'Speedy Pup', 'Hudson scored 25 in Douglas Dash!');
  }
  if (score >= 50 && !S.dashMilestones.m50) {
    S.dashMilestones.m50 = true;
    addJournal('dash50', '📖', 'Super Speedy', 'Hudson scored 50 in Douglas Dash — amazing!');
    award(scene, 'speedy_paws');
  }
  const xp = Math.floor((score || 0) / 5);
  if (xp) grantReward(scene, 0, xp, '');
  checkMemoryKeeper(scene);
  persist();
}
