import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const premium = [
  'title-world.png', 'forest-run.png', 'pirate-island.png', 'dino-valley.png',
  'space-rescue.png', 'pumpkin-patch.png', 'hudson-kingdom.png', 'winter-village.png',
  'finley-playroom.png', 'app-icon.png'
];

function asset(name) {
  return new URL(`../public/assets/premium/${name}`, import.meta.url);
}

function pngSize(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test('premium artwork contains real high-resolution PNG data', () => {
  premium.forEach((name) => {
    const path = asset(name); const buffer = readFileSync(path); const size = pngSize(buffer);
    assert.ok(statSync(path).size > 500_000, `${name} should not be a placeholder`);
    assert.ok(size.width >= 1000 && size.height >= 1000, `${name} should be high resolution`);
  });
});

test('every premium scene texture is referenced and cached for offline play', () => {
  const sceneSources = ['PreloadScene.js', 'DouglasDashScene.js', 'PirateDigScene.js', 'DinoRescueScene.js', 'SpaceRescueScene.js', 'PumpkinSmashScene.js', 'HudsonKingdomScene.js', 'WinterVillageScene.js', 'FinleyChaosScene.js']
    .map((name) => readFileSync(new URL(`../src/scenes/${name}`, import.meta.url), 'utf8')).join('\n');
  const worker = readFileSync(new URL('../public/service-worker.js', import.meta.url), 'utf8');
  premium.forEach((name) => {
    assert.ok(sceneSources.includes(name), `${name} is not loaded by a scene`);
    assert.ok(worker.includes(name), `${name} is missing from the offline cache`);
  });
});

test('installable app metadata includes both required icon sizes', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/manifest.json', import.meta.url), 'utf8'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
});
