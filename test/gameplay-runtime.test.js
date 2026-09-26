import test from 'node:test';
import assert from 'node:assert/strict';
import { chaosBatchSize, eggMatches, isMilestone, isRainbowRound, nearestDestination, nearbyTreasureCount, smoothDelta, withinRadius } from '../src/systems/gameplay.js';

test('lag spikes are capped so moving objects cannot jump across the playfield', () => {
  assert.equal(smoothDelta(16.67), 16.67);
  assert.equal(smoothDelta(900), 50);
  assert.equal(smoothDelta(Number.NaN), 1000 / 60);
  let y = 180;
  [16, 17, 15, 1000, 16, 16].forEach((delta) => { y += smoothDelta(delta) * 0.34; });
  assert.ok(y > 200 && y < 230);
});

test('space collisions use stable circular hit areas', () => {
  assert.equal(withinRadius(100, 100, 150, 100, 58), true);
  assert.equal(withinRadius(100, 100, 170, 100, 58), false);
});

test('pirate proximity clues count corners, edges and diagonals correctly', () => {
  const treasures = new Set([0, 5, 15]);
  assert.equal(nearbyTreasureCount(1, treasures), 2);
  assert.equal(nearbyTreasureCount(10, treasures), 2);
  assert.equal(nearbyTreasureCount(12, treasures), 0);
});

test('Finley drops resolve to the genuinely nearest home', () => {
  const homes = [{ id: 'box', x: 100, y: 100 }, { id: 'bed', x: 600, y: 900 }];
  assert.equal(nearestDestination(570, 860, homes).destination.id, 'bed');
  assert.equal(nearestDestination(110, 130, homes).destination.id, 'box');
});

test('rainbow eggs only appear from the unlock round and honour the roll', () => {
  assert.equal(isRainbowRound(0, 0.01), false);
  assert.equal(isRainbowRound(4, 0.01), false);
  assert.equal(isRainbowRound(5, 0.01), true);
  assert.equal(isRainbowRound(5, 0.5), false);
  assert.equal(isRainbowRound(2, 0.01, 1, 0.9), true);
});

test('a rainbow egg matches any nest, an ordinary egg only its own', () => {
  assert.equal(eggMatches('rainbow', 'sun'), true);
  assert.equal(eggMatches('leaf', 'leaf'), true);
  assert.equal(eggMatches('leaf', 'sun'), false);
});

test('Finley Chaos never doubles up before the unlock round or on the last toy', () => {
  assert.equal(chaosBatchSize(0, 8, true), 1);
  assert.equal(chaosBatchSize(4, 4, true), 2);
  assert.equal(chaosBatchSize(4, 4, false), 1);
  assert.equal(chaosBatchSize(7, 1, true), 1);
});

test('streak milestones fire only on every 5th, never on zero', () => {
  assert.equal(isMilestone(0), false);
  assert.equal(isMilestone(1), false);
  assert.equal(isMilestone(4), false);
  assert.equal(isMilestone(5), true);
  assert.equal(isMilestone(10), true);
  assert.equal(isMilestone(6, 3), true);
});
