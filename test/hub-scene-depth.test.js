import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function source(name) {
  return readFileSync(new URL(`../src/scenes/${name}`, import.meta.url), 'utf8');
}

test('the journal paginates instead of silently hiding memories past a fixed slice', () => {
  const text = source('AdventureJournalScene.js');
  assert.ok(!/S\.journal\.slice\(0,\s*9\)/.test(text), 'journal should not hard-cap at a literal 0-9 slice');
  assert.ok(/this\.page/.test(text), 'journal should track a page offset');
  assert.ok(/scene\.restart\(\{\s*page:/.test(text), 'journal navigation should pass the page forward');
});

test('unlocked trophies and collection items are interactive, not just displayed', () => {
  const trophy = source('TrophyRoomScene.js');
  const collections = source('CollectionsScene.js');
  assert.ok(/setInteractive/.test(trophy) && /showDetail/.test(trophy), 'Trophy Room should let unlocked trophies be opened');
  assert.ok(/setInteractive/.test(collections) && /showDetail/.test(collections), 'Collections should let unlocked items be opened');
});

test('the world map surfaces a real daily challenge zone, not just decoration', () => {
  const text = source('WorldMapScene.js');
  assert.ok(/todaysChallengeZone/.test(text), 'the map should read the actual daily challenge zone from state');
  assert.ok(/DOUBLE STARS/.test(text), 'the map should tell players which zone doubles stars today');
});

test('family photo memories can be read aloud, not just tapped open', () => {
  const text = source('FamilyPhotoWallScene.js');
  assert.ok(/Narrator\.speak/.test(text), 'photo memories should offer a read-aloud detail like trophies and collections');
  assert.ok(/detail:/.test(text), 'each memory should carry its own story detail, not just a title');
  assert.ok(/PhotoCaptionScene/.test(text), 'the wall should link through to caption editing');
});
