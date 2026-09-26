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
