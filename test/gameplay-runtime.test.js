import test from 'node:test';
import assert from 'node:assert/strict';
import { nearestDestination, nearbyTreasureCount, smoothDelta, withinRadius } from '../src/systems/gameplay.js';

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
