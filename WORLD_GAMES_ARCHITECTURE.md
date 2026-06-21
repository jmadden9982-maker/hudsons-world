# World Games — Architecture Proposal

**Status:** Proposal (Phase B design). Phase A stability fix landed first.
**Goal:** Replace the Douglas Dash re-skins with genuinely distinct per-world games.
**Baseline:** APK #93 / `ec44b35` stays the stable rollback target. #94 is NOT promoted.

---

## 1. Diagnosis of the #94 unresponsiveness

**Symptom:** app becomes unresponsive after tapping map links repeatedly for a while.

**Confirmed by inspection:**
- **No scene in the project has any teardown** (`grep` for `shutdown`/cleanup = zero hits). The code relied entirely on Phaser's implicit cleanup.
- **Every navigation calls `scene.start()` from inside a tween `onComplete` / `delayedCall`, with no input lock.** Scene instances in Phaser are reused, so state persists between visits.

**Most likely cause:** re-entrant / overlapping scene transitions. With no input lock during the transition window, rapid or repeated taps (natural for a child hammering the map) fire multiple `scene.start()` calls and overlapping transitions. Phaser's scene manager can get into a tangled start/stop state, and with zero defensive teardown, tweens/timers/input handlers/audio can accumulate across the many map→world→map cycles until the app wedges. The #94 map also recreates 7 infinite tweens + a large background on every return, increasing per-cycle churn.

This is consistent with a cumulative failure ("after a while") rather than an immediate crash.

## 2. Phase A — Stability fix (landed)

Central helpers in `src/ui/kit.js`:
- **`gotoScene(scene, key, data)`** — re-entrancy guard (`scene._navigating`), disables input, fades the camera, then starts exactly once. All navigation now routes through it.
- **`installSceneLifecycle(scene, name)`** — called in `create()`: resets the nav guard + re-enables input for the reused instance, logs `[scene] start/shutdown`, and on shutdown defensively frees tweens (`killAll`), timers (`removeAllEvents`), and input/keyboard listeners.

Wired into the navigation hot paths: WorldMap hotspots + toolbar, the shared back button (covers all scenes), Douglas Dash (back + game-over), and GameOver. Debug logging satisfies the "log scene starts/shutdowns" requirement.

Remaining scenes will get `installSceneLifecycle` as they're touched per world (cheap, additive).

## 3. Phase B — World game architecture

### WorldGameRegistry
A single source of truth mapping each map location to its own scene + metadata.

```
// src/data/worldGames.js
export const WORLD_GAMES = [
  { id:'hudson_town',   name:'Hudson Town',      scene:'TownHelperScene',    bg:'loc_hudson_town',   status:'planned' },
  { id:'douglas_forest',name:'Douglas Forest',   scene:'ForestRescueScene',  bg:'loc_douglas_forest',status:'planned' },
  { id:'pirate_island', name:'Pirate Island',    scene:'TreasureHuntScene',  bg:'loc_pirate_island', status:'planned' },
  { id:'dino_valley',   name:'Dino Valley',      scene:'DinoRescueScene',    bg:'loc_dino_valley',   status:'planned' },
  { id:'space_station', name:'Space Station',     scene:'SpaceRepairScene',   bg:'loc_space_station', status:'planned' },
  { id:'pumpkin_patch', name:'Pumpkin Patch',    scene:'PumpkinFestScene',   bg:'loc_pumpkin_patch', status:'planned' },
  { id:'winter_village',name:'Winter Village',   scene:'SledgeRunScene',     bg:'loc_winter_village',status:'planned' },
  { id:'dragon_peaks',  name:'Dragon Peaks',     scene:'DragonFlightScene',  bg:'loc_dragon_peaks',  status:'planned' },
  { id:'adventure_kingdom',name:'Adventure Kingdom',scene:'CastleQuestScene', bg:'loc_adventure_kingdom',status:'planned' }
];
```

- `WorldMapScene` builds hotspots from this registry. `status:'planned'` → "coming soon" lock; `status:'live'` → routes to its scene via `gotoScene`. Adding a world = flip one field + register its scene. No more `{world:N}` Dash hand-offs.

### Shared base: `WorldGameScene`
A small base class (extends `Phaser.Scene`) so every world game is consistent and safe:
- Standard lifecycle: calls `installSceneLifecycle`, sets the world background, plays music.
- Standard intro card (title + "Tap to start"), pause, and **return-to-map** button (via `gotoScene`).
- Standard win/lose handling → reward via existing `grantReward` + journal, then back to map.
- Each concrete world overrides `startGame()` / `update()` with its own unique mechanics.

This guarantees the "definition of done" items (own scene, return to map, success/failure handling, no-leak teardown) are inherited, so each world only implements its distinctive gameplay.

### Mechanic archetypes (so worlds are genuinely different, not re-skins)
- **Tap/drag tasks:** Hudson Town (helper), Space Station (repair/wires)
- **Hidden-object / explore:** Douglas Forest, Pirate Island (dig + chest puzzle)
- **Catch / sort:** Pumpkin Patch, Dino Valley (match food)
- **Steer / timing:** Winter Village (sledge), Dragon Peaks (flight through rings)
- **Hub / mixed:** Adventure Kingdom (uses stars/trophies earned elsewhere)

## 4. Phase C — First real game: Pirate Island Treasure Hunt
Built fully on `WorldGameScene`: start screen → map with dig spots → tap-to-dig, avoid crabs/coconuts → simple chest lock puzzle → rewards (coins/gems/sticker) → sound → return to map. Phone-tested before moving on.

## 5. Phase D — One world per iteration
Each subsequent world is its own commit + APK + phone test, never a giant risky batch. Order can follow visual strength: Dino, Space, Pumpkin, Winter, Dragon, Hudson Town, Douglas Forest, then Adventure Kingdom (hub last, since it consumes the others' rewards).

## 6. Definition of done (per world)
unique mechanics · own scene · own background · own sounds · rewards · success/failure handling · return to map · no crash on repeated play · build passes · phone test passes. Every new asset passes the existing gate (exists → opens → dims recorded → format verified → previewed → approved).
