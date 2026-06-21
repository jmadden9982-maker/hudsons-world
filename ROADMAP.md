# Hudson's World — Roadmap

Single source of truth for phase status. Detailed audits live in
`ART_INTEGRATION_PLAN.md`; acceptance rules in `ASSET_ACCEPTANCE_CRITERIA.md`;
verified reference art in `reference_library/`.

---

## ⭐ CURRENT STABLE BUILD — known-good rollback checkpoint

| | |
|---|---|
| **APK** | #93 |
| **Commit** | `ec44b35` |
| **Branch** | `claude/hudsons-world-apk-build-m4exvq` |
| **SHA256** | `b0013ce4275ec9f79f1b3ce297948e1c8197b885e60cc47ff34c610ca7a7b799` |
| **Portraits** | Complete (verified on-device) |
| **Family Quests** | Complete (spacing fixed, verified on-device) |
| **Status** | **STABLE BASELINE** |

If future work breaks the build, roll back to `ec44b35`.

---

## The proven pipeline (reuse for every art category)

```
Reference Art → Verification → Asset Creation → Audit → Preview/Sign-off → Integration → Build → APK
```

Every stage gates the next. "The file exists" and "the file is shippable" are
separate checks — open and verify every asset before integration. No claim is
trusted without independent verification.

---

## Phase status

### PORTRAITS — ✅ COMPLETE (APK #87)
- Six real 512×512 RGBA portraits, audited PASS, integrated.
- Portrait loading re-enabled; Family Quests uses real portraits (emoji fallback no longer triggers).
- Commit `6a73160`; build run #92 success. Family Quest card-spacing fix in `ec44b35` (build #93).
- **FROZEN** — do not modify unless fixing a bug.
- **Owner on-device check: ✅ CONFIRMED (2026-06-21)** — Family Quests renders correctly, portraits visible, no overlap. Portrait V1 genuinely done.
- Scope: V1 approved for small UI/avatar use only. Dedicated 2048px transparent per-character source renders still required later (spritesheets, animation, wardrobe, large UI/marketing) — see `reference_library/CHARACTER_EXTRACTION_PLAN.md`.

### PHASE 2 — WORLD MAP ART — 🟡 REFERENCE VERIFIED, awaiting production assets
Highest-value visual upgrade next. The World Map is currently code-drawn.
**Reference received & verified (2026-06-21):** `reference_library/world_map_reference_sheet.png`
(VERIFIED_REFERENCE) — high-quality composite covering all Phase 2 deliverables, but
REFERENCE-ONLY: elements are too small to extract (full map ~190px vs needed 720×1280).
**Blocked on dedicated high-res production assets** — see
`reference_library/WORLD_MAP_EXTRACTION_PLAN.md` for the exact files/specs needed.

Proposed zone deliverables, mapped against existing background assets so we know
what's new vs. a refresh:

| Zone (proposed) | Existing bg asset? | Notes |
|---|---|---|
| World Map background | `bg/worldmap.jpg` exists | refresh / zone-marker overlay |
| Hudson Town | `bg/town.jpg` exists | refresh |
| Pirate Island | `bg/pirate.jpg` exists | refresh |
| Dino Valley | `bg/dino.jpg` exists | refresh |
| Space Station | `bg/space.jpg` exists | refresh |
| Pumpkin Patch | `bg/pumpkin.jpg` exists | refresh |
| Kingdom | `bg/kingdom.jpg` exists | refresh |
| Douglas Forest | none | **new** (closest: `bg/critters.jpg`) |
| Winter Village | none | **new content** |
| Dragon Peaks | none | **new content** |
| Zone markers / cards | none | **new** — 4 states (locked/active/glow/complete) |

Required new art classes: zone marker/card frames, and any net-new zone
backgrounds (Douglas Forest, Winter Village, Dragon Peaks).

**Suggested delivery in 3 packs** (integrate + test each without risking the stable build):
- **Pack 1 — Backgrounds:** main world map + the 9 zones (Hudson Town, Douglas Forest,
  Pirate Island, Dino Valley, Space Station, Pumpkin Patch, Winter Village, Dragon Peaks,
  Adventure Kingdom).
- **Pack 2 — Markers & overlays:** locked / unlocked / completed / selected markers,
  path segments, sparkle effects, cloud overlays.
- **Pack 3 — Motion & audio:** travel animations, unlock animations, region-completion
  animations, world-map sound effects.

### Later phases (not started) — priority order
1. 🌍 World Map overhaul (Phase 2, above) — biggest visual gain per hour
2. 🎮 Douglas Dash improvements (parallax layers, themed obstacles, run/jump spritesheet)
3. 👕 Wardrobe / outfit system (true per-outfit costumes)
4. 🏆 Trophy room visuals
5. 📖 Journal & Photo Wall refresh
6. ✨ UI polish pass

(Character spritesheets for mood/action need the 2048px source renders noted under Portraits.)
