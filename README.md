# Hudson's World: Premium Edition

Hudson's World is a complete, offline-first family adventure made for Hudson. The Premium Edition combines full-resolution cinematic environments, animated lighting and particles, high-DPI rendering, responsive touch controls and scene-specific music with a large permanent progression system. It is built with Phaser 3, Vite and Capacitor, runs in a browser, installs as an Android app, and stores progress only on the device.

There are no adverts, accounts, purchases, guilt timers or punishment for time away. Losing is gentle, progress is permanent, and every activity can be replayed.

## Main adventure

Hudson and Douglas earn five badges to open Hudson Kingdom:

- **Douglas Dash:** a three-lane temple run with swipe controls, jumping, obstacles, bones and friendly hearts.
- **Pirate Island:** a treasure-digging puzzle.
- **Dino Valley:** a symbol, word and colour-matching egg rescue.
- **Space Station:** a free-flight astronaut rescue through a two-dimensional star field.
- **Pumpkin Patch:** a fast, forgiving target game.

Every game uses a different interaction model:

| Adventure | How it plays |
|---|---|
| Douglas Dash | Three-lane runner with swipes and jumping |
| Pirate Island | Deduction puzzle with proximity clues and compass hints |
| Dino Valley | Error-friendly symbol and nest matching |
| Space Rescue | Free-flight two-dimensional drag steering |
| Pumpkin Patch | Precision target tapping and harvest combos |
| Winter Village | Horizontal sleigh catching and avoidance |
| Finley Chaos | Drag-and-drop four-way toy sorting |

The complete progression includes:

- Hudson Kingdom and the replayable Golden Douglas finale
- Hudson Town with six buildable plots and the Mayor Hudson goal
- Winter Village and the Finley Chaos Engine bonus games
- 40 collectible critters and 17 stickers
- three-star scores, XP, ten Hudson levels and permanent family quests
- five Douglas friendship levels, abilities and selectable looks
- Hudson House, Douglas Den, wardrobe, trophies, journal and family photo wall
- Baby Bell discoveries, living weather, day/night colour and surprise world events

## Premium presentation

- nine high-resolution pieces of original game art, including a cinematic title world and distinct adventure environments
- animated depth, atmospheric particles, polished glass-and-gold interface materials and high-DPI rendering
- unique procedural music themes for the map, Kingdom and main adventures, plus layered reward sounds
- bespoke app icon, installable PWA metadata and pre-cached artwork for complete offline play
- responsive portrait layout designed for touch phones and Android packaging

## Accessibility and parent controls

- large forgiving touch targets and keyboard controls where useful
- calm/reduced-motion pacing
- larger text
- narration through the device's speech engine
- sound and vibration controls
- colour-safe mechanics that always use symbols and words as well as colour
- gated Parent Corner with local photo captions and an optional break reminder, off by default
- friendly error recovery instead of a black screen

## Offline support

The Android build is fully local. The web build includes a service worker that caches the game after its first successful load. Save data uses `localStorage` under `hudsonsWorldState`; older `gameState` saves are migrated where possible.

## Run locally

Node.js 22 or newer is required for the Android toolchain.

```bash
npm ci
npm run dev
```

## Test and build

```bash
npm run check
```

`npm run check` runs the progression, collection, town and scene-route tests before producing the release bundle in `dist/`.

## Build the Android APK

```bash
npm ci
npm run check
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. The GitHub Actions workflow performs the same steps and uploads the APK as an artifact after a push to `main` or a manual run.
