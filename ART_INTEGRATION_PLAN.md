# Art Integration Plan & Asset Audit

**Repo:** hudsons-world
**Branch:** `claude/hudsons-world-apk-build-m4exvq`
**Audit date:** 2026-06-21
**Target build:** APK #86
**Status:** Audit complete — integration gated on the recommendations below.

> **UPDATE 2026-06-21 — Reference Library Established.**
> **STATUS:** Reference Library Established. Four verified reference images are
> committed under `reference_library/` (see `reference_library/REFERENCE_LIBRARY_INDEX.md`).
> These are a validated visual bible (real image files, character designs + art
> style confirmed) — NOT game assets and NOT a portrait source.
> **BLOCKER:** Dedicated character source renders required. The reference images are
> composite sheets; per-character art is too small and carries baked-in labels, so it
> cannot be cropped into production portraits (see `reference_library/CHARACTER_EXTRACTION_PLAN.md`).
> **NEXT MILESTONE:** Create six individual high-resolution character renders
> (Hudson, Douglas, Baby Bell, Finley, James, Aimée) suitable for portrait generation.
> Portrait loading remains DISABLED; emoji fallback retained; no APK build pending.


> Purpose: answer "what actually goes into the next build?" — not just "do the files
> exist?" Every asset below was opened and inspected, not merely listed. Dimensions,
> byte sizes, and end-of-image integrity markers were read directly from the files;
> raster assets were visually inspected frame-by-frame.

---

## 1. Methodology

For every asset category the audit checked:

- **Integrity** — file parses as a valid image, correct magic bytes, intact
  end-of-image marker (`FFD9` for JPEG), no truncation.
- **Dimensions** — actual pixel size vs. what the engine/canvas expects
  (game canvas is **720×1280 portrait**).
- **File size** — flagged for both "suspiciously tiny" (placeholder) and "too
  heavy for an APK."
- **Production-readiness** — does it look on-model and shippable, or is it a
  placeholder / broken render?
- **Better than current?** — does integrating it improve on what the code already
  draws procedurally?

Tooling note: this environment has no image library (PIL/ImageMagick), so
dimensions and integrity markers were parsed directly from the JPEG SOF / PNG IHDR
headers with a small script, and every raster asset was opened and viewed.

---

## 2. Asset Inventory (measured)

### Photos — `public/assets/photos/` ✅
11 files, `photo0.jpg`–`photo10.jpg`.

| Property | Finding |
|---|---|
| Dimensions | **1000×750** — uniform across all 11 |
| File size | 35–47 KB each — appropriate |
| Integrity | All valid JPEG, intact `FFD9` EOI marker |
| Note | 1000×750 is **not divisible by 3**; `PhotoPuzzleScene` slices a 3×3 grid with `Math.floor(width/3)` = 333 px, leaving a 1 px seam on the right/bottom edge. Cosmetic only. |

**Grade: Production-ready.** Real, consistent, already wired and shipping.

### Backgrounds — `public/assets/bg/` ✅ (with a caveat)
18 files.

| Property | Finding |
|---|---|
| Dimensions | **1920×1080 landscape** — uniform |
| File size | 47–93 KB each — appropriate |
| Integrity | All valid JPEG, intact EOI |
| Caveat | Canvas is **720×1280 portrait**. `sceneBg()` cover-scales with `Math.max(W/w, H/h)`, so each landscape image is scaled up ~1.19× and **center-cropped to ~32% of its width**. Functional (no letterboxing) but ~68% of every background is discarded, and any content the artist placed left/right of center is lost. |

**Grade: Production-ready, but orientation-mismatched.** Ships fine; a future
portrait-native (720×1280 or 1080×1920) regen would use the art far better.

### Portraits — `public/assets/portraits/` ❌ (4 of 6 broken)
6 files, 512×512 RGBA PNG, all valid/intact at the file level.

| File | Render result | Verdict |
|---|---|---|
| `hudson_portrait.png` | **Tofu box** (□ missing-glyph) where the face should be | ❌ Broken |
| `douglas_portrait.png` | **Tofu box** (□) | ❌ Broken |
| `james_portrait.png` | **Tofu box** (□) | ❌ Broken |
| `finley_portrait.png` | **Tofu box** (□) | ❌ Broken |
| `aimee_portrait.png` | Thin monochrome outline smiley | ⚠️ Generic but not broken |
| `babybell_portrait.png` | Thin monochrome cat-face outline | ⚠️ Generic but not broken |

Root cause: the generator tried to bake an **emoji face** into each portrait, but
the rendering font lacked color-emoji glyphs — so 4 of 6 rendered the Unicode
missing-glyph box. These are used live in `FamilyQuestScene` (circular-masked), so
a shipped tofu portrait looks **worse than the emoji-avatar fallback** the scene
already has.

**Grade: Not production-ready (4 broken, 2 generic).**

### UI frames — `public/assets/ui/` ✅
7 files, valid PNG: `button_large` (420×130), `card` (360×480), `panel` (640×420),
`polaroid_frame` (300×360), `trophy_bronze/silver/gold` (300×360).

| Property | Finding |
|---|---|
| Integrity | All valid RGBA PNG |
| File size | 1–3 KB each — small but these are flat vector-style frames, so plausibly legitimate (not necessarily placeholders) |
| Usage | Only `polaroid_frame` is currently referenced (`FamilyPhotoWallScene`). `panel`/`card` are loaded but unused; trophies loaded but `TrophyRoomScene` should be confirmed. |

**Grade: Usable; needs a quick visual pass + wire-up decision before counting as "integrated."**

### Spritesheets — `public/assets/spritesheets/` — mixed
2 files, 2048×256 (8 × 256×256 frames), valid PNG.

| File | Verdict |
|---|---|
| `douglas_spritesheet.png` | ✅ On-model, matches the cast style, already wired and animating in Dash/Den/Hub. **Production-ready.** |
| `hudson_spritesheet.png` | ❌ **Rejected this session.** Off-model toy-figure proportions, no per-outfit costume theming, and frame 7 ("Space") is identical to frame 0 ("Everyday"). Load is commented out in `PreloadScene`; Wardrobe falls back to the vector Hudson. |

**Grade: 1 production-ready, 1 rejected.**

### World-Map assets — *none exist* ❌
The living world map (zone cards, clouds, sparkles, path, Babybell peek) is
**100% code-drawn** in `WorldMapScene`. There are no dedicated world-map raster
assets in the repo yet.

**Grade: Not present.**

---

## 3. APK #86 Impact Assessment

| Category | Present | Production Ready | Integration Effort | APK #86 Impact |
|---|---|---|---|---|
| **Photos** | Yes | Yes | Low (already wired) | **High** — core to Photo Wall + Photo Puzzle |
| **Backgrounds** | Yes | Yes (orientation-mismatched) | Low (already wired) | **High** — every scene uses one |
| **Portraits** | Yes | **No** (4/6 tofu, 2 generic) | Medium (must regen or keep disabled) | **Low** — emoji fallback already looks better |
| **UI Assets** | Yes | Partial (needs visual pass) | Low–Medium | **Medium** — polish, not blocking |
| **World Map Assets** | **No** | N/A | High (new art + wiring) | **Medium** — biggest visual upside, but not ready |
| **Spritesheets** | Yes | Douglas: Yes / Hudson: **No** | Low (Douglas wired) / Medium (Hudson blocked) | **Medium** — Douglas carries it; Hudson deferred |

---

## 4. Integration Decision

### 4.1 Safe to integrate immediately
- **Photos** (all 11) — already shipping, no change needed.
- **Backgrounds** (all 18) — already shipping; log the portrait-regen as future work.
- **Douglas spritesheet** — already shipping and on-model.

### 4.2 Requires manual review before integrating
- **UI frames** (`button_large`, `card`, `panel`, trophies) — open each, confirm
  they look shippable, then decide which scenes wire them. Small file sizes are
  plausible for flat frames but warrant a human glance.
- **Aimee & Babybell portraits** — outline-only and generic; usable as a stopgap
  but should be judged against keeping the emoji fallback.

### 4.3 Should NOT be integrated
- **Hudson spritesheet** — already rejected and disabled this session (off-model +
  duplicate frame). Keep the file in-repo, keep the loader commented out.
- **Hudson / Douglas / James / Finley portraits** — broken tofu renders. Do **not**
  enable; the emoji-avatar fallback in `FamilyQuestScene` is strictly better.
- **World-map raster assets** — none exist to integrate.

### 4.4 Recommended scope for APK #86
Ship **exactly what's already wired and verified**: photos, backgrounds, Douglas
spritesheet, and the polaroid frame. No new art enabled. This is the lowest-risk
build and contains zero broken assets.

- Optional, low-risk add: a quick UI-frame visual pass; wire only the ones that
  pass.

### 4.5 Recommended scope for APK #87+
1. **Regenerate the 6 portraits** with real drawn faces (no baked emoji) matching
   the cast style — highest-value fix, unblocks Family Quests visuals.
2. **Redo the Hudson spritesheet** on-model with true per-outfit costumes
   (cape/eye-patch/helmet/crown), no duplicate frames.
3. **First world-map art pack** — zone-card frame in 4 states + sparkle/cloud/path
   sprites, wired into `WorldMapScene`.
4. **Portrait-native backgrounds** (720×1280) so art isn't 68%-cropped.
5. Douglas mood/action animation set for the Den; Games-Hub thumbnails.

---

## 5. Verification & Gating

- This audit was produced by inspecting the files directly; it should be
  **independently verified** before APK #86 is cut, given the number of moving
  parts (Claude-generated, Grok-generated, existing, placeholder, and any
  claimed-but-unmerged GitHub uploads).
- **Gate:** do not enable any asset graded "Not production-ready" or "Requires
  manual review" until it has passed an explicit visual check by a second party.
- Re-run this audit whenever a new art pack lands. Treat "the file exists" and
  "the file is shippable" as two separate checks — every incoming pack gets the
  full integrity + visual + better-than-current pass before integration.

---

## 6. Current Asset Status (as of 2026-06-21)

| Asset | Status |
|---|---|
| Photos | ✅ Production-ready |
| Backgrounds | ✅ Production-ready |
| Douglas spritesheet | ✅ Production-ready |
| Polaroid frame | ✅ Production-ready |
| Family portraits | ❌ Missing (no valid PNGs in repo) |
| Hudson spritesheet | ❌ Needs replacement |
| World map art | ❌ Missing |

**APK #87 objective (narrow, single-focus):**
1. Obtain six real portrait PNGs.
2. Audit them (this document's full integrity + visual pass).
3. Re-enable portrait loading in `src/scenes/PreloadScene.js`.
4. Build APK #87.

Rationale: Family Quests is already live, so portraits are the highest-visibility
missing asset in the game. Nothing else is in scope for #87.

---

## 7. Portrait Audit Log

### Portrait Audit Log — 2026-06-21

**Commit audited:** `724c71d5d703c4f37386f75db0fac7fb50a460f3`
("Replace family portraits with production-ready versions", on `origin/main`)

**Result:** FAILED

**Summary:**
All six portrait files committed in this change were discovered to be 18-byte
ASCII text placeholders containing the literal string:

> `Binary PNG 512x512`

No valid PNG image data was present (no PNG signature, no IHDR, no pixel data; all
six files byte-identical, MD5 `0c7c753a1c5f537cbc0eec7cab0e4658`). The associated
report had claimed these were 512×512 transparent PNGs of 283–352 KB — that claim
did not match the committed files. The commit existed; the described assets did not.

**Files affected:**
- `hudson_portrait.png`
- `douglas_portrait.png`
- `james_portrait.png`
- `aimee_portrait.png`
- `finley_portrait.png`
- `babybell_portrait.png`

**Decision:**
- Do not integrate.
- Do not enable portrait loading.
- Retain emoji-avatar fallback in Family Quests.

**Action required:**
Replace all six portrait files with verified PNG binaries and re-run this audit
before integration. (Detection tip: a real binary commit shows a `Bin` diff; these
showed a `2 +-` text-line diff — the tell that a binary was committed as text.)

**APK #86 impact:** None. Commit `724c71d` is on `main`, not on the build branch
`claude/hudsons-world-apk-build-m4exvq`. The #86 build (`ebdd2a7`) already has
portrait loading disabled with the emoji fallback, so the shipped APK never
references these stubs. No rebuild required.

### Portrait Audit Log — 2026-06-21 (in-repo files, branch `claude/hudsons-world-apk-build-m4exvq` @ `7ba80cd`)

Independent re-audit of the six portrait PNGs actually present in the build branch
working tree, against `ASSET_ACCEPTANCE_CRITERIA.md`.

**Overall result: FAILED** (technical PASS, visual FAIL on all six)

**Technical validation — PASS (all six):** valid 512×512 RGBA PNGs with real,
non-zero image data (not stubs).

| File | Dimensions | Size | SHA256 |
|---|---|---|---|
| hudson_portrait.png | 512×512 | 10391 B | `f499e298f2575702bf0d3f4a187a5b307131ed234508b249e32cc67538099d88` |
| douglas_portrait.png | 512×512 | 11873 B | `b5e6c27eea333171edfefe100c3452b9e148fee506e8426c08b1d4d9befb05e5` |
| james_portrait.png | 512×512 | 10446 B | `d6e0597f892d89c8e4ff348dbf125d5f48a98c38a88fcb9ff9c6bbdc24239d2a` |
| aimee_portrait.png | 512×512 | 16380 B | `1f16daec95ccfabf62f034e562ca0e5b8fa125a4f0007a216e3f43a7d5fd530e` |
| finley_portrait.png | 512×512 | 9161 B | `0c3623a4b0eb2ae4285990e87f5dee38cc03373075210a4372569f346b202f4d` |
| babybell_portrait.png | 512×512 | 19878 B | `d26639c3cd2b26483f2166360ca9d2d428bdd664f6e0a4ca9de3975af4b462ec` |

**Visual validation — FAIL (all six):**

| File | Visual result | Verdict |
|---|---|---|
| hudson | Tofu missing-glyph box (□), baked-in name text | FAIL |
| douglas | Tofu missing-glyph box (□), baked-in name text | FAIL |
| james | Tofu missing-glyph box (□), baked-in name text | FAIL |
| finley | Tofu missing-glyph box (□), baked-in name text | FAIL |
| aimee | Generic outline-only smiley (no character identity), baked-in name text | FAIL |
| babybell | Generic outline-only cat face (no character identity), baked-in name text | FAIL |

Criteria violated: missing-glyph boxes (4 files); generic outline-only / no real
illustrated face (aimee, babybell); **baked-in text — all six have the character
name rendered into the image**, which the criteria explicitly forbids.

**Decision:**
- Do not integrate. Do not enable portrait loading.
- Retain emoji-avatar fallback in Family Quests.
- **Phase 1 (six real portraits) has NOT passed.** No downstream categories
  (World Map, spritesheets, UI) unblock.

**Action required:** Source six genuinely illustrated portrait PNGs (real faces, no
baked-in text, character-accurate, on Hudson's World style) and re-run this audit.

### Portrait Audit Log — 2026-06-21 (commit `8f2a7d0`)

Audit of commit `8f2a7d0d24b2555eab98c6cf270378509c63fc9e` ("Replace portraits with
verified illustrated faces", on `origin/main`), against `ASSET_ACCEPTANCE_CRITERIA.md`.

**Result: FAILED**

**Technical validation — FAIL at first check.** All six files are **10-byte ASCII
text stubs** containing the literal string `Binary PNG`. Not valid PNGs (no
signature), no dimensions, no pixel data. All six byte-identical, SHA256
`6034a7a91b6900af2f8dd9d6037211e0fb2bd01f998cb2d1d62fdb68e9b03a35`.

**Visual validation — N/A** (no image to open).

This is the **second** "verified" portrait commit that proved to be stubs:
- `724c71d` → 18-byte `Binary PNG 512x512` stubs.
- `8f2a7d0` → 10-byte `Binary PNG` stubs.

Both diffs showed `2 +-` text-line changes rather than a `Bin` binary diff — the
reliable tell that no real binary was committed. The "verified illustrated faces"
commit message did not match the committed content.

**Decision:**
- Do not integrate. Do not enable portrait loading.
- Retain emoji-avatar fallback in Family Quests.
- **Phase 1 remains OPEN.** No downstream categories unblock.

**Action required:** Commit six real PNG binaries. Verify before claiming success:
`file <name>` must report `PNG image data` (not `ASCII text`), and `git show --stat`
must show a `Bin` diff (not `2 +-`). Then re-run this audit.
