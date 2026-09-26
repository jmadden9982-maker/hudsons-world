import test from 'node:test';
import assert from 'node:assert/strict';

const originalFetch = global.fetch;
function mockFetch(response) {
  global.fetch = async () => response;
}

const mod = await import('../src/systems/UpdateCheck.js');

test('no update is reported when the release lookup fails', async () => {
  mockFetch({ ok: false });
  const result = await mod.checkForUpdate();
  assert.equal(result.updateAvailable, false);
  assert.equal(result.latestSha, null);
});

test('an update is reported when the release points at a different build than this one', async () => {
  const differentSha = mod.CURRENT_BUILD === 'abcdefg' ? 'gfedcba' : 'abcdefg';
  mockFetch({ ok: true, json: async () => ({ target_commitish: differentSha }) });
  const result = await mod.checkForUpdate();
  assert.equal(result.updateAvailable, true);
  assert.equal(result.latestSha, differentSha);
});

test('no update is reported when the release matches the running build', async () => {
  mockFetch({ ok: true, json: async () => ({ target_commitish: mod.CURRENT_BUILD }) });
  const result = await mod.checkForUpdate();
  assert.equal(result.updateAvailable, false);
});

test('a network failure is treated as no update rather than a crash', async () => {
  global.fetch = async () => { throw new Error('offline'); };
  const result = await mod.checkForUpdate();
  assert.equal(result.updateAvailable, false);
  assert.equal(result.latestSha, null);
});

test.after(() => { global.fetch = originalFetch; });
