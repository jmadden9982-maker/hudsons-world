import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function source(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
}

test('the settings screen offers a manual update check that links to the release page', () => {
  const text = source('src/scenes/SettingsScene.js');
  assert.ok(/checkForUpdate/.test(text), 'Settings should call the update checker');
  assert.ok(/openReleasePage/.test(text), 'Settings should be able to open the release download page');
});

test('the main menu silently checks for an update once per session', () => {
  const text = source('src/scenes/MainMenuScene.js');
  assert.ok(/checkForUpdateOnce/.test(text), 'the main menu should use the once-per-session checker, not the raw one');
});

test('the APK workflow signs every build with the same committed debug keystore', () => {
  const text = source('.github/workflows/build-apk.yml');
  assert.ok(/\.github\/keystores\/debug\.keystore/.test(text), 'the workflow should reuse the checked-in debug keystore so updates install over old ones');
  assert.ok(/~\/\.android\/debug\.keystore/.test(text), 'the keystore should be placed where Gradle\'s default debug signing config looks for it');
});

test('the APK workflow publishes a rolling release so the download link always serves the latest build', () => {
  const text = source('.github/workflows/build-apk.yml');
  assert.ok(/tag:\s*latest-apk/.test(text), 'the release should use a stable, rolling tag');
  assert.ok(/allowUpdates:\s*true/.test(text), 'the release should update in place rather than failing on a second build');
  assert.ok(/commit:\s*\$\{\{\s*github\.sha\s*\}\}/.test(text), 'the release should point at the exact commit it was built from, so the in-app check can compare against it');
});
