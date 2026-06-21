# Hudson's World — Assets that MUST be committed

> **Before integrating any asset, see [`ASSET_ACCEPTANCE_CRITERIA.md`](./ASSET_ACCEPTANCE_CRITERIA.md)**
> for the required technical + visual validation gate, and `ART_INTEGRATION_PLAN.md`
> for the standing asset status and audit log. "The file exists" and "the file is
> shippable" are two separate checks — open every asset and verify it before wiring.


The build is green, but the repo contains **no art or audio**. Every file below is
referenced by the code and loaded by `PreloadScene`. All loads are error-tolerant and
all scene usage is guarded, so missing files never crash — they just fall back to flat
colours/silence (which is exactly why the APK looked basic). Commit these to light it up.

Paths are relative to the project root. Vite serves `public/` at the web root, so
`public/assets/bg/house.jpg` loads as `assets/bg/house.jpg` (matches Preload).

## 1. Backgrounds — public/assets/bg/   (1920x1080 .jpg)
USED ON SCREEN NOW: house.jpg, journal.jpg, photowall.jpg, trophies.jpg
Loaded and ready for when the other scenes are wired to sceneBg() (phase 10):
mainmenu.jpg, worldmap.jpg, town.jpg, den.jpg, wardrobe.jpg, quests.jpg, critters.jpg,
dash.jpg, pirate.jpg, dino.jpg, space.jpg, pumpkin.jpg, kingdom.jpg, gameover.jpg
(18 files total)

## 2. Family photos — public/assets/photos/   (.jpg)
photo0.jpg, photo1.jpg, ... photo10.jpg   (11 files — TOTAL=11 in FamilyPhotoWallScene)
USED ON SCREEN NOW by the Family Photo Wall.

## 3. UI frames — public/assets/ui/   (transparent .png)
USED ON SCREEN NOW: polaroid_frame.png (Photo Wall), trophy_gold.png (Trophy Room)
Loaded, optional until referenced: trophy_silver.png, trophy_bronze.png,
button_large.png, panel.png, card.png

## 4. Character sprite sheets — public/assets/spritesheets/   (transparent .png, 8x 256x256 frames)
douglas_spritesheet.png, hudson_spritesheet.png
(Loaded now; the current Dash/Den/Wardrobe scenes don't reference them yet — that's a
phase-10 wiring step. Baby Bell & Finley sheets still need creating as transparent 256px frames.)

## 5. Portraits — public/assets/portraits/   (transparent .png)
hudson_portrait.png, douglas_portrait.png, babybell_portrait.png,
finley_portrait.png, james_portrait.png, aimee_portrait.png   (for dialogue, phase 10)
STATUS (2026-06-21): BLOCKED — no valid portrait PNGs exist. The committed files
are broken (tofu/outline renders) and the attempted replacement (commit 724c71d)
was 18-byte text stubs. Portrait loading is disabled in PreloadScene; Family Quests
uses emoji avatars. Six real PNGs must pass ASSET_ACCEPTANCE_CRITERIA.md before
loading is re-enabled (APK #87 milestone).

## 6. Audio — public/assets/audio/   (.mp3)
button_click, button_confirm, coin_pickup, bone_pickup, bone_collect, reward,
reward_reveal, error, achievement, achievement_fanfare, douglas_bark, douglas_happy,
golden_shimmer, legendary_chime, sparkle_swell   (15 files, e.g. button_click.mp3)
NOTE: audio is file-based (AudioManager.playSfx plays only loaded sounds). One extra
wiring step is needed for sound to actually play: a scene must call
`AudioManager.setScene(this)` (e.g. in MainMenuScene.create). Flagged for phase 10.
