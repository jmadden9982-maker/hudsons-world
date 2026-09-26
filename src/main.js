import './systems/errorOverlay.js';
import Phaser from 'phaser';
import BreakReminder from './systems/BreakReminder.js';

import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import IntroScene from './scenes/IntroScene.js';
import WorldMapScene from './scenes/WorldMapScene.js';
import DouglasDashScene from './scenes/DouglasDashScene.js';
import PirateDigScene from './scenes/PirateDigScene.js';
import DinoRescueScene from './scenes/DinoRescueScene.js';
import SpaceRescueScene from './scenes/SpaceRescueScene.js';
import PumpkinSmashScene from './scenes/PumpkinSmashScene.js';
import HudsonHouseScene from './scenes/HudsonHouseScene.js';
import DouglasDenScene from './scenes/DouglasDenScene.js';
import AdventureJournalScene from './scenes/AdventureJournalScene.js';
import FamilyPhotoWallScene from './scenes/FamilyPhotoWallScene.js';
import TrophyRoomScene from './scenes/TrophyRoomScene.js';
import WardrobeScene from './scenes/WardrobeScene.js';
import QuestScene from './scenes/QuestScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import HudsonKingdomScene from './scenes/HudsonKingdomScene.js';
import HudsonTownScene from './scenes/HudsonTownScene.js';
import CollectionsScene from './scenes/CollectionsScene.js';
import FinleyChaosScene from './scenes/FinleyChaosScene.js';
import WinterVillageScene from './scenes/WinterVillageScene.js';
import ParentGateScene from './scenes/ParentGateScene.js';
import ParentZoneScene from './scenes/ParentZoneScene.js';
import PhotoCaptionScene from './scenes/PhotoCaptionScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 720,
  height: 1280,
  resolution: Math.min(window.devicePixelRatio || 1, 1.5),
  backgroundColor: '#1b1430',
  render: {
    antialias: true,
    antialiasGL: true,
    roundPixels: false,
    powerPreference: 'high-performance'
  },
  fps: {
    target: 60,
    min: 30,
    smoothStep: true
  },
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    IntroScene,
    WorldMapScene,
    DouglasDashScene,
    PirateDigScene,
    DinoRescueScene,
    SpaceRescueScene,
    PumpkinSmashScene,
    HudsonHouseScene,
    DouglasDenScene,
    AdventureJournalScene,
    FamilyPhotoWallScene,
    TrophyRoomScene,
    WardrobeScene,
    QuestScene,
    SettingsScene,
    HudsonKingdomScene,
    HudsonTownScene,
    CollectionsScene,
    FinleyChaosScene,
    WinterVillageScene,
    ParentGateScene,
    ParentZoneScene,
    PhotoCaptionScene,
    GameOverScene
  ]
};

window.game = new Phaser.Game(config);
BreakReminder.install();

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
