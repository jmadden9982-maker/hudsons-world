# Hudson's World — Roadmap

Single source of truth for phase status. Detailed audits live in
`ART_INTEGRATION_PLAN.md`; acceptance rules in `ASSET_ACCEPTANCE_CRITERIA.md`;
verified reference art in `reference_library/`.

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

### PHASE 2 — WORLD MAP ART — ⏳ PENDING reference art
Highest-value visual upgrade next. **Blocked** until reference art is delivered
and verified (same gate as portraits). The World Map is currently code-drawn.

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

### Later phases (not started)
- Douglas Dash asset packs (parallax layers, themed obstacles, run/jump spritesheet)
- Wardrobe outfits (true per-outfit costumes)
- Character spritesheets (mood/action — needs 2048px source renders)
- Trophy room artwork
- Quest artwork
- UI refresh

---

## Current build
- **Stable baseline:** APK #93 (commit `ec44b35`) — portraits integrated, Family Quest
  spacing fixed, build green, confirmed on-device. SHA256
  `b0013ce4275ec9f79f1b3ce297948e1c8197b885e60cc47ff34c610ca7a7b799`.
- Branch: `claude/hudsons-world-apk-build-m4exvq`.
- Locked: Portraits, Family Quests. Do not modify unless a genuine bug is found.
