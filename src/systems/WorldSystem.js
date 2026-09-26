import Phaser from 'phaser';
import { S, addJournal, addSticker, persist, unlockNextCritter } from './state.js';
import { textStyle, toast } from '../ui/kit.js';

let surpriseShownThisSession = false;

function daySeed() {
  const d = new Date(); return Number(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`);
}

export function worldMood() {
  const hour = new Date().getHours();
  const phase = hour < 6 || hour >= 20 ? 'night' : hour < 11 ? 'morning' : hour < 17 ? 'day' : 'sunset';
  const weathers = ['sunny', 'breezy', 'rainbow', 'drizzle'];
  return { phase, weather: weathers[daySeed() % weathers.length] };
}

export function worldLabel() {
  const { phase, weather } = worldMood();
  const phases = { night: 'Moonlit', morning: 'Good morning', day: 'Bright day', sunset: 'Golden evening' };
  const weatherLines = { sunny: 'and sunny', breezy: 'with a friendly breeze', rainbow: 'with a rainbow', drizzle: 'with tiny raindrops' };
  return `${phases[phase]} ${weatherLines[weather]}`;
}

export function decorateLivingWorld(scene) {
  const { width: W, height: H } = scene.scale; const mood = worldMood();
  if (mood.phase === 'night') {
    scene.add.rectangle(W / 2, H / 2, W, H, 0x15133c, 0.42).setDepth(-2);
    for (let i = 0; i < 16; i += 1) scene.add.circle(Phaser.Math.Between(20, W - 20), Phaser.Math.Between(130, 700), 2, 0xffffff, 0.65).setDepth(-1);
  } else if (mood.phase === 'sunset') scene.add.rectangle(W / 2, H / 2, W, H, 0xff9a5a, 0.14).setDepth(-2);
  if (mood.weather === 'drizzle') {
    for (let i = 0; i < 24; i += 1) {
      const drop = scene.add.text(Phaser.Math.Between(10, W - 10), Phaser.Math.Between(120, H - 100), '•', textStyle(18, '#d9f3ff')).setAlpha(0.55).setDepth(-1);
      scene.tweens.add({ targets: drop, y: drop.y + 90, alpha: 0, duration: 1100 + i * 25, repeat: -1 });
    }
  }
  if (mood.weather === 'rainbow') scene.add.text(W - 80, 160, '🌈', textStyle(70)).setOrigin(0.5).setAlpha(0.78).setDepth(-1);
}

export function maybeShowSurprise(scene) {
  if (surpriseShownThisSession || S.plays < 1) return;
  surpriseShownThisSession = true;
  const events = [
    { icon: '🐱', sticker: 'babybell-box', title: 'Baby Bell!', line: 'Baby Bell dashed across the map with a sparkly box.' },
    { icon: '🌠', sticker: 'shooting-star', title: 'Shooting Star!', line: 'Hudson spotted a shooting star over the town.' },
    { icon: '🌈', sticker: 'rainbow-day', title: 'Rainbow!', line: 'A giant rainbow appeared over Hudson’s World.' },
    { icon: '👶', sticker: 'finley-whirl', title: 'Finley Eruption!', line: 'Finley arrived with a ball and cheerful chaos.' }
  ];
  const event = events[daySeed() % events.length];
  scene.time.delayedCall(1200, () => {
    if (!scene.sys.isActive()) return;
    const surprise = scene.add.text(scene.scale.width - 85, 855, event.icon, textStyle(68)).setOrigin(0.5).setDepth(90).setInteractive({ useHandCursor: true });
    scene.tweens.add({ targets: surprise, y: surprise.y - 18, duration: 550, yoyo: true, repeat: -1 });
    surprise.on('pointerdown', () => {
      addSticker(event.sticker); S.surprisesFound += 1; const critter = unlockNextCritter();
      addJournal(`surprise-${event.sticker}`, event.icon, event.title, event.line); persist(); surprise.destroy();
      toast(scene, `${event.title}${critter ? ` New critter: ${critter.icon} ${critter.name}` : ''}`, 0x6c4ccf, 2400);
    });
  });
}
