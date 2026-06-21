// Phase 12.2 — Douglas the Virtual Pet.
// Save-safe stat model (lives in S.pet), gentle real-time decay (never punishing —
// stats floor at 0, Douglas never gets sick or leaves), friendship levels, moods,
// care actions, and a once-per-day gift. All writes persist through the shared S blob.
import { S, persist } from './state.js';
import AudioManager from './AudioManager.js';
import { grantReward, unlockPhoto, addJournal } from './progression.js';

const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
const todayStr = () => new Date().toISOString().split('T')[0];

const TITLES = [
  { lvl: 1,  name: 'New Friend' },
  { lvl: 5,  name: 'Best Buddy' },
  { lvl: 10, name: 'Adventure Partner' },
  { lvl: 20, name: 'Family Hero' },
  { lvl: 50, name: 'Legendary Douglas' }
];

export function petState() {
  if (!S.pet || typeof S.pet !== 'object') S.pet = {};
  const p = S.pet;
  if (typeof p.happiness !== 'number') p.happiness = 80;
  if (typeof p.hunger !== 'number') p.hunger = 70;     // higher = better fed
  if (typeof p.energy !== 'number') p.energy = 80;
  if (typeof p.friendshipXP !== 'number') p.friendshipXP = 0;
  if (!p.lastUpdate) p.lastUpdate = Date.now();
  if (!('lastGift' in p)) p.lastGift = null;
  return p;
}

// Gentle decay based on real time away, so "how is Douglas today?" is meaningful.
export function applyDecay() {
  const p = petState();
  const now = Date.now();
  const hrs = (now - p.lastUpdate) / 3600000;
  if (hrs > 0.02) {
    p.happiness = clamp(p.happiness - hrs * 4);
    p.hunger = clamp(p.hunger - hrs * 6);
    p.energy = clamp(p.energy - hrs * 3);
    p.lastUpdate = now;
    persist();
  }
  return p;
}

export function friendshipLevel() { return Math.min(50, Math.floor(petState().friendshipXP / 100) + 1); }
export function friendshipTitle() { const l = friendshipLevel(); let t = TITLES[0].name; TITLES.forEach(x => { if (l >= x.lvl) t = x.name; }); return t; }
export function friendshipProgress() { return (petState().friendshipXP % 100) / 100; }

function addFriendship(xp) {
  const p = petState();
  const before = friendshipLevel();
  p.friendshipXP += xp;
  const after = friendshipLevel();
  return after > before ? after : 0; // returns new level on level-up, else 0
}

// Mood is derived from the current stats (priority: needs first, then feeling).
export function mood() {
  const p = petState();
  if (p.hunger < 25) return { key: 'hungry',  emoji: '🍖', line: 'Do you have a snack?' };
  if (p.energy < 25) return { key: 'sleepy',  emoji: '😴', line: 'Can we rest for a bit?' };
  if (p.happiness >= 80) return { key: 'happy', emoji: '😄', line: "Today's a great day!" };
  if (p.happiness < 40) return { key: 'lonely', emoji: '🥺', line: 'I missed you...' };
  return { key: 'content', emoji: '🐶', line: 'Wag wag!' };
}

function act(changes, fx, line, friendXp) {
  const p = petState();
  Object.entries(changes).forEach(([k, v]) => { p[k] = clamp(p[k] + v); });
  const lvlUp = addFriendship(friendXp);
  p.lastUpdate = Date.now();
  persist();
  if (fx) { try { AudioManager.playSfx(fx); } catch (e) {} }
  return { line, lvlUp };
}

export const actions = {
  pet:   () => act({ happiness: +12 }, 'douglas_happy', 'Douglas loves cuddles!', 8),
  feed:  () => act({ hunger: +26, happiness: +5 }, 'douglas_happy', 'Yum yum! Thank you!', 6),
  fetch: () => {
    if (petState().energy < 12) return { line: 'Douglas is too sleepy to play.', lvlUp: 0 };
    return act({ happiness: +16, energy: -12 }, 'douglas_bark', 'Woof! Great throw!', 10);
  },
  brush: () => act({ happiness: +8 }, 'button_confirm', 'So shiny and soft!', 5),
  sleep: () => act({ energy: +34, happiness: +3 }, 'button_click', 'Zzz... thank you!', 4)
};

export function giftAvailable() { return petState().lastGift !== todayStr(); }

// Once-per-day gift Douglas "brings". Routes through progression so HUD/journal/photos update.
export function claimDailyGift(scene) {
  const p = petState();
  if (p.lastGift === todayStr()) return null;
  p.lastGift = todayStr();
  persist();
  const roll = Math.random();
  let line;
  if (roll < 0.18) {
    let unlocked = false;
    for (let i = 0; i < 11 && !unlocked; i++) unlocked = unlockPhoto(i);
    addJournal('gift_photo_' + todayStr(), '📸', 'A Buried Memory', 'Douglas dug up an old photo for the album!');
    grantReward(scene, 5, 10, 'Douglas found a photo!');
    line = 'I dug this up for you!';
  } else if (roll < 0.4) {
    grantReward(scene, 50, 15, 'Rare treasure!');
    line = 'Look what I found!';
  } else {
    grantReward(scene, 15, 10, 'Douglas brought bones!');
    line = "Here's a present for you!";
  }
  return { line };
}
