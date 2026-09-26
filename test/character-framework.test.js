import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { CHARACTERS, getCharacter, getCharacterArt, hasRegisteredArt } from '../src/data/characters.js';
import { animKey, facingScale } from '../src/systems/characterMotion.js';

test('every character entry is complete and self-consistent', () => {
  Object.entries(CHARACTERS).forEach(([id, character]) => {
    assert.equal(character.id, id);
    assert.ok(character.name && character.name.length > 0);
    assert.ok(character.emoji && character.emoji.length > 0);
    assert.equal(typeof character.color, 'number');
  });
});

test('getCharacter/getCharacterArt resolve known ids and return null for unknown ones', () => {
  assert.equal(getCharacter('douglas').name, 'Douglas');
  assert.equal(getCharacter('nobody'), null);
  assert.equal(getCharacterArt('nobody'), null);
  assert.equal(hasRegisteredArt('nobody'), false);
});

test('every character now has real registered art', () => {
  Object.keys(CHARACTERS).forEach((id) => {
    assert.ok(hasRegisteredArt(id), `${id} should have registered art`);
    assert.ok(getCharacterArt(id).texture, `${id} art is missing a texture key`);
  });
});

test('animKey namespaces animation keys per character so ids never collide', () => {
  assert.equal(animKey('douglas', 'idle'), 'douglas-idle');
  assert.equal(animKey('hudson', 'idle'), 'hudson-idle');
});

test('facingScale flips sign for direction while preserving magnitude', () => {
  assert.equal(facingScale(1, -1), -1);
  assert.equal(facingScale(1, 1), 1);
  assert.equal(facingScale(1.4, -1), -1.4);
  assert.equal(facingScale(-2, 1), 2);
});

test('every createActor() call in a scene references a registered character id', () => {
  const scenesDir = new URL('../src/scenes/', import.meta.url);
  const files = readdirSync(scenesDir).filter((name) => name.endsWith('.js'));
  const missing = [];
  files.forEach((name) => {
    const text = readFileSync(new URL(name, scenesDir), 'utf8');
    for (const match of text.matchAll(/createActor\([^,]+,\s*['"]([^'"]+)['"]/g)) {
      if (!CHARACTERS[match[1]]) missing.push(`${name}: ${match[1]}`);
    }
  });
  assert.deepEqual(missing, []);
});
