import Phaser from 'phaser';

// Import scenes that exist
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
import FamilyQuestScene from './scenes/FamilyQuestScene.js';
import GamesHubScene from './scenes/GamesHubScene.js';
import MemoryMatchScene from './scenes/MemoryMatchScene.js';
import BoneHuntScene from './scenes/BoneHuntScene.js';
import PhotoPuzzleScene from './scenes/PhotoPuzzleScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 720,
  height: 1280,
  backgroundColor: '#1b1430',
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
    WorldMapScene,
    DouglasDashScene,
    HudsonHouseScene,
    DouglasDenScene,
    AdventureJournalScene,
    FamilyPhotoWallScene,
    TrophyRoomScene,
    WardrobeScene,
    FamilyQuestScene,
    GamesHubScene,
    MemoryMatchScene,
    BoneHuntScene,
    PhotoPuzzleScene,
    GameOverScene
  ]
};

new Phaser.Game(config);