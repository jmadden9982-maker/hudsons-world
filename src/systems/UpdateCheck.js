import { Browser } from '@capacitor/browser';

const REPO = 'jmadden9982-maker/hudsons-world';
const RELEASE_TAG = 'latest-apk';
export const RELEASE_PAGE_URL = `https://github.com/${REPO}/releases/tag/${RELEASE_TAG}`;

export const CURRENT_BUILD = typeof __BUILD_SHA__ !== 'undefined' ? __BUILD_SHA__ : 'dev';

let checkedThisSession = false;

// The CI release step points the rolling "latest-apk" tag's target_commitish
// at the exact commit it built, so comparing it to the sha baked into this
// build is a reliable "is a newer build sitting on GitHub" check — no
// silent auto-install is possible for a sideloaded APK, so this only ever
// surfaces the fact and a link, never installs anything itself.
export async function checkForUpdate() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${RELEASE_TAG}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!res.ok) return { updateAvailable: false, latestSha: null };
    const data = await res.json();
    const latestSha = (data.target_commitish || '').slice(0, 7);
    const updateAvailable = Boolean(latestSha) && latestSha !== CURRENT_BUILD;
    return { updateAvailable, latestSha };
  } catch {
    return { updateAvailable: false, latestSha: null };
  }
}

export async function checkForUpdateOnce() {
  if (checkedThisSession) return { updateAvailable: false, latestSha: null };
  checkedThisSession = true;
  return checkForUpdate();
}

export async function openReleasePage() {
  try { await Browser.open({ url: RELEASE_PAGE_URL }); }
  catch { window.open?.(RELEASE_PAGE_URL, '_blank'); }
}
