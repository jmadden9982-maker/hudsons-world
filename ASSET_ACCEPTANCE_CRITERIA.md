# Asset Acceptance Criteria

This file turns asset-review decisions into **repository rules**. No asset may be
integrated into Hudson's World until it passes the criteria for its category.
See `ART_INTEGRATION_PLAN.md` for the standing audit log and asset status.

Rule of thumb established 2026-06-21: **"the file exists" and "the file is
shippable" are two separate checks.** A commit existing is not evidence the asset
exists — open it and verify. (See the failed portrait audit in
`ART_INTEGRATION_PLAN.md` §7: a commit replaced all six portraits with 18-byte
text stubs reading `Binary PNG 512x512`.)

---

## Portrait Acceptance Criteria (APK #87)

Before any portrait asset may be integrated into Hudson's World, all of the
following must pass.

### Required files
- `hudson_portrait.png`
- `douglas_portrait.png`
- `james_portrait.png`
- `aimee_portrait.png`
- `finley_portrait.png`
- `babybell_portrait.png`

All under `public/assets/portraits/`.

### Technical validation
For every file:
- File exists in `public/assets/portraits/`
- Valid PNG image (`file <name>` reports `PNG image data`)
- Opens successfully in an image viewer
- 512 × 512 pixels
- Transparent background
- Non-zero image data
- Not a text file
- Not a placeholder
- Not a stub

Record for each file:
- Filename
- Dimensions
- File size
- SHA256 hash

### Visual validation
Must:
- Contain a real illustrated face
- Match the approved Hudson's World style
- Match character identity
- Be suitable for the Family Quests UI
- Be readable at small size

Must NOT:
- Contain tofu / missing-glyph boxes
- Contain emoji glyphs
- Contain baked-in text
- Contain placeholder graphics
- Contain generic silhouette-only art

### Audit procedure
1. Commit asset.
2. Verify asset exists in the repository.
3. Open asset directly from the committed version (not a local copy).
4. Perform technical validation.
5. Perform visual validation.
6. Mark each file: **PASS** / **FAIL** / **NEEDS REWORK**.

### Definition of done
Portraits are complete only when:
- All six files PASS technical validation.
- All six files PASS visual validation.
- Audit results are recorded (in `ART_INTEGRATION_PLAN.md` §7).
- Portrait loading is re-enabled in `src/scenes/PreloadScene.js`.
- APK #87 builds successfully.
- Family Quests is visually verified on-device.

---

## Roadmap

| Stage | Target |
|---|---|
| Current stable build | APK #86 |
| Next milestone | Six real portraits |
| Next build | APK #87 |
| After that | Living World Map art pack |
