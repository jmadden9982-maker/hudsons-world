import Phaser from 'phaser';
import { S, campaignBadges, kingdomUnlocked } from '../systems/state.js';
import { ambientMotes, button, COLORS, hud, premiumBackdrop, roundedPanel, starRow, textStyle, toast, topBar } from '../ui/kit.js';
import AudioManager from '../systems/AudioManager.js';
import { decorateLivingWorld, maybeShowSurprise, worldLabel } from '../systems/WorldSystem.js';

const zones = [
  { id: 'forest', label: 'DOUGLAS DASH', sub: 'Temple trail', icon: '🐶', scene: 'DouglasDashScene', x: 205, y: 285, color: 0x3e9e55 },
  { id: 'pirate', label: 'PIRATE ISLAND', sub: 'Treasure dig', icon: '🏴‍☠️', scene: 'PirateDigScene', x: 515, y: 285, color: 0xd9862c },
  { id: 'dino', label: 'DINO VALLEY', sub: 'Egg rescue', icon: '🦖', scene: 'DinoRescueScene', x: 205, y: 515, color: 0x249989 },
  { id: 'space', label: 'SPACE STATION', sub: 'Rocket rescue', icon: '🚀', scene: 'SpaceRescueScene', x: 515, y: 515, color: 0x4f5fb9 },
  { id: 'pumpkin', label: 'PUMPKIN PATCH', sub: 'Harvest smash', icon: '🎃', scene: 'PumpkinSmashScene', x: 205, y: 745, color: 0xe76527 }
];

export default class WorldMapScene extends Phaser.Scene {
  constructor() { super('WorldMapScene'); }
  create() {
    AudioManager.setScene(this);
    const { width: W, height: H } = this.scale;
    premiumBackdrop(this, 'premium-title', { shade: 0.3 }); ambientMotes(this, { count: 12, color: 0xffe38d }); decorateLivingWorld(this); topBar(this, 'HUDSON’S ADVENTURE MAP', { back: false, settings: true }); hud(this);
    const path = this.add.graphics().setDepth(-5); path.lineStyle(14, 0xffe8a6, 0.9);
    path.beginPath(); path.moveTo(205, 285); path.lineTo(515, 285); path.lineTo(205, 515); path.lineTo(515, 515); path.lineTo(205, 745); path.lineTo(515, 745); path.strokePath();

    zones.forEach((zone) => {
      roundedPanel(this, zone.x, zone.y, 270, 190, 0xffffff, 0.97, zone.color);
      this.add.circle(zone.x, zone.y - 45, 47, zone.color, 0.16);
      this.add.text(zone.x, zone.y - 48, zone.icon, textStyle(51)).setOrigin(0.5);
      this.add.text(zone.x, zone.y + 16, zone.label, textStyle(17, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
      this.add.text(zone.x, zone.y + 43, zone.sub, textStyle(14, '#766b87')).setOrigin(0.5);
      starRow(this, zone.x, zone.y + 73, S.zoneStars[zone.id] || 0, 21);
      const hit = this.add.zone(zone.x, zone.y, 270, 190).setInteractive({ useHandCursor: true });
      hit.on('pointerdown', () => { AudioManager.playSfx('button_confirm'); this.scene.start(zone.scene); });
    });

    const open = kingdomUnlocked();
    roundedPanel(this, 515, 745, 270, 190, open ? 0xfff4b2 : 0xe6e0ec, 0.98, open ? 0xd99e19 : 0x938aa2);
    this.add.text(515, 700, open ? '🏰' : '🔒', textStyle(54)).setOrigin(0.5);
    this.add.text(515, 760, 'HUDSON KINGDOM', textStyle(17, COLORS.ink, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(515, 792, open ? 'The gates are open!' : `${campaignBadges()} / 5 badges`, textStyle(14, open ? '#39824b' : '#766b87', { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.zone(515, 745, 270, 190).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      if (open) this.scene.start('HudsonKingdomScene'); else toast(this, 'Earn a badge in all five adventures to open the gates!', 0x6c4ccf, 1700);
    });

    this.add.text(W / 2, 850, `${worldLabel()} • ${open ? 'The Kingdom is open!' : 'Earn five badges for the Kingdom'}`, textStyle(15, '#ffffff', { fontStyle: 'bold' })).setOrigin(0.5);
    const nav = [
      ['🏘️ TOWN', 'HudsonTownScene', 0x3f9c62], ['🏠 HOUSE', 'HudsonHouseScene', 0xf36f5f], ['✅ QUESTS', 'QuestScene', 0x47a8e8],
      ['🐾 COLLECTIONS', 'CollectionsScene', 0x249989], ['📖 JOURNAL', 'AdventureJournalScene', 0x6c4ccf], ['🐶 DOUGLAS', 'DouglasDenScene', 0x9b683d],
      ['❄️ WINTER', 'WinterVillageScene', 0x5b91c9], ['👕 WARDROBE', 'WardrobeScene', 0x8b63c7], ['⌂ MENU', 'MainMenuScene', 0x40365f]
    ];
    nav.forEach(([label, scene, color], i) => {
      const x = 135 + (i % 3) * 225; const y = 925 + Math.floor(i / 3) * 85;
      button(this, x, y, label, () => {
        if (scene === 'WinterVillageScene' && !open) toast(this, 'Winter Village opens after all five adventure badges!', 0x5b91c9, 1700);
        else this.scene.start(scene);
      }, { width: 205, height: 62, color, fontSize: 15 });
    });
    maybeShowSurprise(this);
  }
}
