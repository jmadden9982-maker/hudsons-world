# Reference Library Index

**Status:** Reference Library Established (2026-06-21)
**Location:** `reference_library/`
**Purpose:** Canonical, independently-verified visual bible for Hudson's World.
These are **reference / style-guide images only** — NOT game assets, NOT to be
loaded by the game, NOT to be cropped into production portraits. They define
character design and art style for producing dedicated source renders later.

## Verification

All files below were opened and validated as genuine image files (valid headers,
real pixel data — not the text-stub placeholders seen in earlier delivery attempts).
The original upload contained 6 slots but two were byte-identical duplicate pairs,
so they consolidate to **4 unique images**.

| File | Dimensions | Size | Format | SHA256 | Purpose | Status |
|---|---|---|---|---|---|---|
| `asset_pack_overview.png` | 1536×1024 | 2,570,635 B | PNG | `3933e288d7a439472b4d1859012a8ae86996ebcf535bb797e29dd7756e8d77af` | Asset-pack overview; **contains the CHARACTERS reference sheet** (all 6 designs + pose turnarounds), UI-kit preview, icons/items, critter cards | VERIFIED_REFERENCE |
| `background_pack_index.png` | 1402×1122 | 2,802,098 B | PNG | `68cf73799e58659db0e37d9119cd4e5d4c0220dd973ec2f11f9360384fa3f4e1` | Full background art pack — 18 labeled scenes (names match repo bg files) | VERIFIED_REFERENCE |
| `hero_keyart.jpg` | 1536×1024 | 555,004 B | JPEG | `c9ba9bb9feb52e45aa496b3f23304a9c048ac3e56cd190eb5a87695c3ff8b952` | Hero / key-art mockup — full cast, larger faces; secondary face reference | VERIFIED_REFERENCE |
| `screen_mockups.jpg` | 1536×1024 | 641,851 B | JPEG | `02d34891eb5deb29f78a516f47c24903e15e1ff552303e13d3a17c7cf82ed483` | 3×3 screen mockups (Main Menu, World Map, Town, Den, Mini-Games, Quests, Wardrobe, Photo Wall, Dash) — UI/layout reference | VERIFIED_REFERENCE |
| `world_map_reference_sheet.png` | 1536×1024 | 2,580,890 B | PNG | `2df54510609645c8ceedbbdc76e1bd19d25fb2ae23300a81ee9234017820552a` | World Map Pack v1 (Phase 2) — full map, day/dusk/night/storm variants, 9 location close-ups, 4 zone-marker states, path segments, location icons, overlays/effects, travel + unlock animation refs, audio cues. Full decode + PIL verify() passed. | VERIFIED_REFERENCE |

## Established character designs

From `asset_pack_overview.png` (CHARACTERS sheet) and `hero_keyart.jpg`:

- **Hudson** — brown-haired boy, explorer outfit (tan vest, teal shirt)
- **Douglas** — brown/black dachshund, red collar
- **Baby Bell** — grey tabby cat, white chest
- **Finley** — blond toddler, teal top
- **James (Dad)** — burly, red/auburn beard, overalls
- **Aimée (Mum)** — blonde, purple/floral dress

## Do-not list (per project policy)

- Do NOT load these from the game.
- Do NOT crop production portraits from these composite sheets (faces are
  ~80–130 px and sit under baked-in name labels — extraction is unusable; see
  `ART_INTEGRATION_PLAN.md` and `CHARACTER_EXTRACTION_PLAN.md`).
- Do NOT treat these as final assets — they are the style guide.
