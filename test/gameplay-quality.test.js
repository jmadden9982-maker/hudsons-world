import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GAME_MODES } from '../src/data/gameModes.js';

test('every premium game has a unique control and gameplay loop', () => {
  assert.equal(GAME_MODES.length, 7);
  assert.equal(new Set(GAME_MODES.map((mode) => mode.control)).size, GAME_MODES.length);
  assert.equal(new Set(GAME_MODES.map((mode) => mode.loop)).size, GAME_MODES.length);
});

test('continuous-motion games use frame delta and calm-mode pacing', () => {
  ['DouglasDashScene.js', 'SpaceRescueScene.js', 'WinterVillageScene.js'].forEach((file) => {
    const source = readFileSync(new URL(`../src/scenes/${file}`, import.meta.url), 'utf8');
    assert.match(source, /update\(time, delta\)/, `${file} should use a frame-rate-independent update loop`);
    assert.match(source, /delta \*/, `${file} should scale movement by frame delta`);
    assert.match(source, /S\.settings\.calm/, `${file} should support calm pacing`);
  });
});

test('large adventure worlds load on demand instead of blocking startup', () => {
  const preload = readFileSync(new URL('../src/scenes/PreloadScene.js', import.meta.url), 'utf8');
  assert.doesNotMatch(preload, /forest-run\.png|space-rescue\.png|winter-village\.png|finley-playroom\.png/);
  ['DouglasDashScene.js', 'PirateDigScene.js', 'DinoRescueScene.js', 'SpaceRescueScene.js', 'PumpkinSmashScene.js', 'WinterVillageScene.js', 'FinleyChaosScene.js'].forEach((file) => {
    const source = readFileSync(new URL(`../src/scenes/${file}`, import.meta.url), 'utf8');
    assert.match(source, /queuePremiumBackdrop/, `${file} should lazy-load its environment`);
    assert.match(source, /transient: true/, `${file} should release its large texture after leaving`);
  });
});
