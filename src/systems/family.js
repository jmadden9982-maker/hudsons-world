// Phase 12.5 — Family daily quests & dialogue.
// Save-safe: one daily quest per family member, deterministic per day, progress hooked
// into existing gameplay events. Standalone state in S.family; rewards routed through
// progression (stars/xp/journal) and the pet (happiness). Never throws on missing data.
import { S, persist } from './state.js';
import AudioManager from './AudioManager.js';
import { grantReward, addJournal } from './progression.js';
import { petState } from './pet.js';

export const ORDER = ['james', 'aimee', 'finley', 'babybell'];

export const FAMILY = {
  james: {
    name: 'James (Dad)', portrait: 'portrait_james', avatar: '👨',
    open: 'Ready for an adventure, wee explorer?', done: 'Great work, wee explorer!',
    quests: [
      { id: 'james_dash',  text: 'Play Douglas Dash once',     type: 'dash_play', goal: 1,  reward: { stars: 15, xp: 10 } },
      { id: 'james_bones', text: 'Collect 10 bones in Dash',   type: 'bones',     goal: 10, reward: { stars: 20, xp: 10 } }
    ]
  },
  aimee: {
    name: 'Aimee (Mum)', portrait: 'portrait_aimee', avatar: '👩',
    open: 'Hello darling! Shall we make a memory?', done: "That's a lovely memory for the album.",
    quests: [
      { id: 'aimee_care',  text: 'Check on Douglas today',     type: 'care',  goal: 1, reward: { stars: 10, xp: 8, happiness: 5 } },
      { id: 'aimee_chest', text: 'Claim the daily chest',      type: 'chest', goal: 1, reward: { stars: 10, xp: 8 } }
    ]
  },
  finley: {
    name: 'Finley', portrait: 'portrait_finley', avatar: '🧒',
    open: 'Ball! Ball! Wanna play?', done: 'Yay! Douglas is so happy!',
    quests: [
      { id: 'finley_dash', text: 'Go for a Dash run',          type: 'dash_play', goal: 1, reward: { stars: 12, xp: 8 } },
      { id: 'finley_care', text: 'Play with Douglas 3 times',  type: 'care',      goal: 3, reward: { stars: 15, xp: 10, happiness: 5 } }
    ]
  },
  babybell: {
    name: 'Babybell', portrait: 'portrait_babybell', avatar: '🐱',
    open: 'Prrr... look closely...', done: 'Prrr... I found something sparkly.',
    quests: [
      { id: 'bell_star',  text: 'Find a shiny star in Dash',  type: 'star',  goal: 1,  reward: { stars: 25, xp: 12 } },
      { id: 'bell_bones', text: 'Dig up 15 bones in Dash',    type: 'bones', goal: 15, reward: { stars: 25, xp: 12 } }
    ]
  }
};

const todayStr = () => new Date().toISOString().split('T')[0];
const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

function pickIndex(memberKey, poolLen) {
  const s = todayStr() + memberKey;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % poolLen;
}

function ensure() {
  if (!S.family || typeof S.family !== 'object') S.family = { day: null, q: {} };
  const f = S.family;
  if (!f.q || typeof f.q !== 'object') f.q = {};
  if (f.day !== todayStr()) {
    f.day = todayStr();
    ORDER.forEach(k => { f.q[k] = { idx: pickIndex(k, FAMILY[k].quests.length), prog: 0, claimed: false }; });
    persist();
  }
  // Defensive: fill any missing member entry.
  ORDER.forEach(k => { if (!f.q[k]) f.q[k] = { idx: pickIndex(k, FAMILY[k].quests.length), prog: 0, claimed: false }; });
  return f;
}

function activeQuest(memberKey) {
  const f = ensure();
  const slot = f.q[memberKey];
  const q = FAMILY[memberKey].quests[slot.idx] || FAMILY[memberKey].quests[0];
  return { slot, quest: q };
}

export function getQuests() {
  ensure();
  return ORDER.map(key => {
    const { slot, quest } = activeQuest(key);
    return {
      key, member: FAMILY[key], quest,
      prog: Math.min(slot.prog, quest.goal), goal: quest.goal,
      claimed: slot.claimed, complete: slot.prog >= quest.goal
    };
  });
}

// Called from gameplay when an event occurs (e.g. 'dash_play', 'bones', 'star', 'care', 'chest').
export function track(eventKey, amount = 1) {
  const f = ensure();
  let changed = false;
  ORDER.forEach(key => {
    const { slot, quest } = activeQuest(key);
    if (quest.type === eventKey && !slot.claimed && slot.prog < quest.goal) {
      slot.prog = Math.min(quest.goal, slot.prog + amount);
      changed = true;
    }
  });
  if (changed) persist();
}

export function claim(scene, memberKey) {
  const { slot, quest } = activeQuest(memberKey);
  if (slot.claimed || slot.prog < quest.goal) return null;
  slot.claimed = true;
  const r = quest.reward || {};
  if (r.happiness) { const p = petState(); p.happiness = clamp(p.happiness + r.happiness); }
  addJournal('fam_' + quest.id + '_' + todayStr(), '⭐', 'Family Time', FAMILY[memberKey].name.split(' ')[0] + ' was so proud of Hudson today!');
  grantReward(scene, r.stars || 0, r.xp || 0, FAMILY[memberKey].name.split(' ')[0] + ' says thanks!');
  try { AudioManager.playSfx('achievement'); } catch (e) {}
  persist();
  return { line: FAMILY[memberKey].done };
}

export function openLine(memberKey) { return FAMILY[memberKey] ? FAMILY[memberKey].open : ''; }
