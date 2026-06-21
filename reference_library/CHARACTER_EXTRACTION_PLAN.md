# Character Extraction Plan

**Status:** Blocked on dedicated character source renders.
**Date:** 2026-06-21

## Why this plan exists

The verified reference images (`REFERENCE_LIBRARY_INDEX.md`) are **composite
style-guide sheets**, not individual character renders. The per-character art in
them is small (~80–130 px) and sits directly under baked-in name labels, so it
**cannot** be mechanically cropped into clean production assets. A direct
extraction attempt produced empty crops, text-contaminated frames, and heavy
upscale blur — confirming this is reference material only.

Therefore, production assets must be built from **dedicated source renders** — one
clean image per character per purpose, in the style the reference library defines.
This document specifies exactly what source renders are required.

## Required source renders, per character

For **each** character, four dedicated source renders are required. All should be
on a transparent or trivially-removable flat background, with **no text/labels**,
in the established Hudson's World style.

| Source render | Purpose | Suggested spec |
|---|---|---|
| **Portrait source** | Generate `<name>_portrait.png` (512×512 circular badge) for Family Quests | Head + upper body, centered, ≥512 px shortest side |
| **Turnaround source** | Build directional/idle frames; consistency check | Front / 3·4 / side, full body, ≥512 px tall |
| **Expression source** | Mood/dialogue variants (happy, surprised, etc.) | Head close-up set, ≥512 px, consistent framing |
| **Animation source** | Spritesheet frames (walk/run/jump/action) | Full body pose set, uniform canvas, ≥256 px/frame |

### Hudson
- Portrait source: **required** — clean head/upper-body render
- Turnaround source: **required** — front/side/back
- Expression source: **required** — happy/excited/neutral
- Animation source: **required** — idle/run/jump (used by Dash + general UI)
- Reference: `asset_pack_overview.png` (CHARACTERS row, leftmost) + `hero_keyart.jpg` (center boy)

### Douglas
- Portrait source: **required** — dachshund head/upper-body
- Turnaround source: **required** — side profile critical for the dog
- Expression source: **required** — happy/wag, hungry, sleepy (for Den moods)
- Animation source: **required** — run/jump/bark (Dash + Den)
- Reference: `asset_pack_overview.png` (Douglas, + existing pose row: run/jump/bark/happy); existing `douglas_spritesheet.png` already audited usable

### Baby Bell
- Portrait source: **required** — cat head/upper-body
- Turnaround source: **required**
- Expression source: **required** — for World Map "peek" discovery
- Animation source: **optional/low priority** — peek/bob only
- Reference: `asset_pack_overview.png` (Baby Bell)

### Finley
- Portrait source: **required** — toddler head/upper-body
- Turnaround source: **required**
- Expression source: **required**
- Animation source: **optional** — low priority for now
- Reference: `asset_pack_overview.png` (Finley)

### James (Dad)
- Portrait source: **required** — head/upper-body (face is largest in references)
- Turnaround source: **optional**
- Expression source: **optional**
- Animation source: **not required** currently
- Reference: `asset_pack_overview.png` (James) + `hero_keyart.jpg` (right, bearded)

### Aimée (Mum)
- Portrait source: **required** — head/upper-body
- Turnaround source: **optional**
- Expression source: **optional**
- Animation source: **not required** currently
- Reference: `asset_pack_overview.png` (Aimée) + `hero_keyart.jpg` (left, blonde)

## Immediate next milestone (minimum to unblock Phase 3 portraits)

Six **portrait source renders** — one per character (Hudson, Douglas, Baby Bell,
Finley, James, Aimée) — clean, label-free, ≥512 px. Turnaround / expression /
animation sources can follow per category.

Once portrait sources exist, the build pipeline is mechanical and verifiable:
frame → circular mask → 512×512 RGBA transparent → validate against
`ASSET_ACCEPTANCE_CRITERIA.md` → preview → re-enable loading → APK #87.
