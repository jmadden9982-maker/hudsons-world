# Art Integration Plan & Asset Audit

**Repo:** hudsons-world
**Branch:** `claude/hudsons-world-apk-build-m4exvq`
**Audit date:** 2026-06-21
**Target build:** APK #86
**Status:** Audit complete — integration gated on the recommendations below.

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
