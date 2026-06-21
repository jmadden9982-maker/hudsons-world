# World Map Extraction / Production Plan (Phase 2)

**Status:** Reference verified. Blocked on dedicated high-res production assets.
**Date:** 2026-06-21
**Reference:** `reference_library/world_map_reference_sheet.png` (VERIFIED_REFERENCE)

## Why this plan exists

`world_map_reference_sheet.png` is a verified, high-quality **composite style guide**
covering all Phase 2 deliverables. It is **reference only** (the pack's own manifest
says so). Every element on it is a small thumbnail — too small to extract into
production assets:

| Element on sheet | Approx size on sheet | Game needs | Verdict |
|---|---|---|---|
| Full world map | ~190 px wide | 720×1280 | too small — dedicated render required |
| Location close-ups (×9) | ~80 px each | 720×720 | too small — dedicated renders required |
| Zone marker states (×4) | ~40 px each | ~96–128 px transparent | borderline — dedicated PNGs preferred |
| Path segments / icons / overlays | small | 256 px / transparent | dedicated PNGs preferred |

This mirrors portraits: the reference *sheets* were unusable for extraction, but the
separate **high-res character pack** was. The World Map needs the same — dedicated
high-res individual assets, delivered as a production pack, then audited.

## Required production assets (the actual Phase 2 input)

Delivered as individual files (transparent PNG where noted), then run through the
standard gate (verify → audit → preview → integrate → build).

### Pack 1 — Backgrounds (opaque PNG/JPEG)
- `worldmap_full.png` — 720×1280 (portrait, matches canvas)
- 9 location backgrounds @ 720×720 (or 1920×1080 if reused as scene bg):
  Hudson Town, Douglas Forest, Pirate Island, Dino Valley, Space Station,
  Pumpkin Patch, Winter Village, Dragon Peaks, Adventure Kingdom
- Optional map variants: day / dusk / night / storm (or tint in code)

### Pack 2 — Markers & overlays (transparent PNG)
- Zone marker, 4 states: `marker_locked/unlocked/completed/selected.png` (~128 px)
- Path segment sprite(s)
- Overlays: clouds, sparkles, light rays, leaves, fog
- Location icons (UI) @ 256×256

### Pack 3 — Motion & audio
- Travel animation frames (spritesheet or frame set)
- Unlock animation frames (burst / confetti / glow pulse)
- Audio cues: page/pan, select, travel, unlock, complete

## Integration note (low technical risk)

`WorldMapScene` already has the navigation logic — it currently draws colored
rectangles with working tap-to-scene handlers. Integration is mostly: swap the
flat background for `worldmap_full`, replace rectangles with marker sprites in
their states, add path art, wire existing handlers to the new markers. No
transparency-masking, fallback, or identity-check complexity like portraits had.

## Style lock (from the verified reference)

Bright, friendly, colourful, hand-painted. Zones connected by visible paths with a
sense of progression/exploration. Must match the painted backgrounds already in
`public/assets/bg/` and the portrait art style.
