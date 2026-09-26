import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const scenesDir = new URL('../src/scenes/', import.meta.url);
const files = readdirSync(scenesDir).filter((name) => name.endsWith('.js'));
const sources = files.map((name) => ({ name, text: readFileSync(new URL(name, scenesDir), 'utf8') }));
const keys = new Set();

for (const source of sources) {
  for (const match of source.text.matchAll(/super\(['"]([^'"]+)['"]\)/g)) keys.add(match[1]);
}

test('every directly referenced scene route exists', () => {
  const targets = new Set();
  for (const source of sources) {
    for (const match of source.text.matchAll(/scene\.start\(['"]([^'"]+)['"]/g)) targets.add(match[1]);
    for (const match of source.text.matchAll(/scene:\s*['"]([^'"]+Scene)['"]/g)) targets.add(match[1]);
    for (const match of source.text.matchAll(/['"]([A-Z][A-Za-z]+Scene)['"]/g)) targets.add(match[1]);
  }
  const missing = [...targets].filter((target) => !keys.has(target));
  assert.deepEqual(missing, []);
});

test('every concrete scene is registered by the game entry point', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const unregistered = sources
    .filter(({ name, text }) => name !== 'AdventureBase.js' && /super\(['"][^'"]+['"]\)/.test(text))
    .filter(({ name }) => !main.includes(`./scenes/${name}`))
    .map(({ name }) => name);
  assert.deepEqual(unregistered, []);
});
