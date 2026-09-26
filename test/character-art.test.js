import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { CHARACTER_ART, CHARACTERS } from '../src/data/characters.js';

function asset(name) {
  return new URL(`../public/assets/characters/${name}.png`, import.meta.url);
}

function pngSize(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test('every registered character has a real spritesheet at the expected grid size', () => {
  Object.entries(CHARACTER_ART).forEach(([id, art]) => {
    const path = asset(id); const buffer = readFileSync(path); const size = pngSize(buffer);
    assert.ok(statSync(path).size > 500_000, `${id}.png should not be a placeholder`);
    assert.equal(size.width, art.frameWidth * 6, `${id}.png width should be 6 columns of ${art.frameWidth}px`);
    assert.equal(size.height, art.frameHeight * 4, `${id}.png height should be 4 rows of ${art.frameHeight}px`);
  });
});

test('every CHARACTER_ART entry has a matching CHARACTERS registry entry and complete states', () => {
  Object.keys(CHARACTER_ART).forEach((id) => {
    assert.ok(CHARACTERS[id], `${id} is missing from CHARACTERS`);
    const { states } = CHARACTER_ART[id];
    ['idle', 'walk', 'celebrate', 'hurt'].forEach((state) => {
      assert.ok(states[state], `${id} is missing the ${state} animation state`);
      assert.ok(states[state].end >= states[state].start, `${id}.${state} has an invalid frame range`);
    });
  });
});

test('every character spritesheet is preloaded and cached for offline play', () => {
  const preload = readFileSync(new URL('../src/scenes/PreloadScene.js', import.meta.url), 'utf8');
  const worker = readFileSync(new URL('../public/service-worker.js', import.meta.url), 'utf8');
  Object.keys(CHARACTER_ART).forEach((id) => {
    assert.ok(preload.includes(`assets/characters/`), 'PreloadScene should load character spritesheets');
    assert.ok(worker.includes(`assets/characters/${id}.png`), `${id}.png is missing from the offline cache`);
  });
});
