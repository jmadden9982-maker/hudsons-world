import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
global.localStorage = {
  getItem: (key) => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, value),
  removeItem: (key) => store.delete(key)
};

const state = await import('../src/systems/state.js');

test('five first-time adventure completions unlock the Kingdom', () => {
  state.resetProgress();
  for (const id of state.ZONE_IDS) state.recordAdventure(id, 500, 1);
  assert.equal(state.campaignBadges(), 5);
  assert.equal(state.kingdomUnlocked(), true);
  assert.ok(state.S.achievements.includes('all-zones'));
  assert.ok(state.S.journal.some((entry) => entry.id === 'kingdom-open'));
});

test('replays only award newly earned zone stars', () => {
  state.resetProgress();
  state.recordAdventure('forest', 300, 1);
  const afterOne = state.S.stars;
  state.recordAdventure('forest', 350, 1);
  assert.equal(state.S.stars, afterOne);
  state.recordAdventure('forest', 900, 3);
  assert.equal(state.S.stars, afterOne + 2);
});

test('Douglas care is kind, capped and advances the friendship quest', () => {
  state.resetProgress();
  for (let i = 0; i < 10; i += 1) state.careForDouglas('play');
  assert.equal(state.S.douglas.joy, 100);
  assert.equal(state.S.quests.friend.value, 3);
  assert.ok(state.S.achievements.includes('best-friends'));
});

test('completed quests can only be claimed once', () => {
  state.resetProgress();
  state.progressQuest('friend', 3);
  assert.equal(state.claimQuest('friend'), true);
  const stars = state.S.stars;
  assert.equal(state.claimQuest('friend'), false);
  assert.equal(state.S.stars, stars);
});

test('six unique town buildings make Hudson mayor', () => {
  state.resetProgress();
  ['home', 'park', 'library', 'workshop', 'bakery', 'school'].forEach((building, plot) => {
    assert.equal(state.buildTownPlot(plot, building), true);
  });
  assert.equal(state.townProgress(), 6);
  assert.equal(state.S.town.mayor, true);
  assert.ok(state.S.outfits.includes('mayor'));
  assert.ok(state.S.achievements.includes('mayor-hudson'));
});

test('town does not allow the same building on two plots', () => {
  state.resetProgress();
  assert.equal(state.buildTownPlot(0, 'home'), true);
  assert.equal(state.buildTownPlot(1, 'home'), false);
  assert.equal(state.townProgress(), 1);
});

test('Douglas reaches level five and unlocks every look', () => {
  state.resetProgress();
  state.addDouglasXp(240);
  assert.equal(state.S.douglas.level, 5);
  assert.deepEqual(state.S.douglas.skins, ['classic', 'scout', 'pirate', 'space', 'golden']);
  assert.ok(state.S.achievements.includes('legendary-friend'));
});

test('adventure replays discover new critters without duplicates', () => {
  state.resetProgress();
  const first = state.recordAdventure('pirate', 500, 2).critter;
  const second = state.recordAdventure('pirate', 550, 2).critter;
  assert.ok(first && second);
  assert.notEqual(first.id, second.id);
  assert.equal(new Set(state.S.critters).size, state.S.critters.length);
});
