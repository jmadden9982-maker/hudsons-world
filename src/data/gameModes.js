export const GAME_MODES = [
  { id: 'forest', title: 'Douglas Dash', control: 'swipe lanes and jump', loop: 'three-lane endless runner', skill: 'timing and reactions' },
  { id: 'pirate', title: 'Pirate Island', control: 'tap a deduction grid', loop: 'proximity-clue treasure puzzle', skill: 'logic and planning' },
  { id: 'dino', title: 'Dino Valley', control: 'tap a matching symbol', loop: 'error-friendly nursery matching', skill: 'symbols and observation' },
  { id: 'space', title: 'Space Rescue', control: 'drag freely in two dimensions', loop: 'free-flight rescue mission', skill: 'steering and spatial awareness' },
  { id: 'pumpkin', title: 'Pumpkin Patch', control: 'precision target taps', loop: 'combo-based harvest reaction game', skill: 'focus and quick decisions' },
  { id: 'winter', title: 'Winter Village', control: 'slide horizontally to catch', loop: 'one-axis sleigh catcher', skill: 'tracking and anticipation' },
  { id: 'finley', title: 'Finley Chaos', control: 'drag objects into destinations', loop: 'four-way tidy sorting game', skill: 'classification and coordination' }
];

export const gameMode = (id) => GAME_MODES.find((mode) => mode.id === id);
