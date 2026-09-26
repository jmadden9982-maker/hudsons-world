import test from 'node:test';
import assert from 'node:assert/strict';

const legacy = {
  stars: 12,
  unlockedPhotos: [0, 3],
  achievements: { first_adventure: true, memory_keeper: false },
  doug: { xp: 120, mood: 75, skin: 'classic', skins: ['classic'] },
  settings: { calm: true }
};

const store = new Map([['gameState', JSON.stringify(legacy)]]);
global.localStorage = {
  getItem: (key) => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, value),
  removeItem: (key) => store.delete(key)
};

const { S } = await import('../src/systems/state.js?legacy-save-test');

test('older Hudson’s World saves migrate without losing useful progress', () => {
  assert.equal(S.stars, 12);
  assert.equal(S.settings.calm, true);
  assert.equal(S.douglas.joy, 75);
  assert.equal(S.douglas.level, 3);
  assert.ok(S.douglas.skins.includes('pirate'));
  assert.ok(S.achievements.includes('first_adventure'));
  assert.ok(S.photos.includes('family'));
  assert.ok(S.photos.includes('dino'));
});
