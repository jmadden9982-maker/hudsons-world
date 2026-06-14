import Phaser from 'phaser';

// Import all scenes
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import WorldMapScene from './scenes/WorldMapScene.js';
import DouglasDashScene from './scenes/DouglasDashScene.js';
import HudsonHouseScene from './scenes/HudsonHouseScene.js';
import DouglasDenScene from './scenes/DouglasDenScene.js';
import AdventureJournalScene from './scenes/AdventureJournalScene.js';
import FamilyPhotoWallScene from './scenes/FamilyPhotoWallScene.js';
import TrophyRoomScene from './scenes/TrophyRoomScene.js';
import WardrobeScene from './scenes/WardrobeScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// Game configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 720,
  height: 1280,
  backgroundColor: '#1b1430',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 320, height: 568 },
    max: { width: 1280, height: 2560 }
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
    WorldMapScene,
    DouglasDashScene,
    HudsonHouseScene,
    DouglasDenScene,
    AdventureJournalScene,
    FamilyPhotoWallScene,
    TrophyRoomScene,
    WardrobeScene,
    GameOverScene
  ]
};

// Start the game
new Phaser.Game(config);