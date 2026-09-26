export const CRITTERS = [
  ['moss-bug', 'Mossy', '🐛', 'Douglas Forest'], ['acorn-mouse', 'Acorn Mouse', '🐭', 'Douglas Forest'],
  ['twig-owl', 'Twig Owl', '🦉', 'Douglas Forest'], ['fern-frog', 'Fern Frog', '🐸', 'Douglas Forest'],
  ['berry-fox', 'Berry Fox', '🦊', 'Douglas Forest'], ['puddle-duck', 'Puddle Duck', '🦆', 'Douglas Forest'],
  ['bark-badger', 'Bark Badger', '🦡', 'Douglas Forest'], ['moon-moth', 'Moon Moth', '🦋', 'Douglas Forest'],
  ['pearl-crab', 'Pearl Crab', '🦀', 'Pirate Island'], ['sailor-parrot', 'Sailor Parrot', '🦜', 'Pirate Island'],
  ['map-monkey', 'Map Monkey', '🐒', 'Pirate Island'], ['coin-turtle', 'Coin Turtle', '🐢', 'Pirate Island'],
  ['coconut-pup', 'Coconut Pup', '🐕', 'Pirate Island'], ['coral-fish', 'Coral Fish', '🐠', 'Pirate Island'],
  ['shell-snail', 'Shell Snail', '🐌', 'Pirate Island'], ['captain-penguin', 'Captain Penguin', '🐧', 'Pirate Island'],
  ['pebble-raptor', 'Pebble Raptor', '🦖', 'Dino Valley'], ['leafy-saurus', 'Leafy-saurus', '🦕', 'Dino Valley'],
  ['egg-lizard', 'Egg Lizard', '🦎', 'Dino Valley'], ['amber-bee', 'Amber Bee', '🐝', 'Dino Valley'],
  ['cave-bat', 'Cave Bat', '🦇', 'Dino Valley'], ['fossil-frog', 'Fossil Frog', '🐸', 'Dino Valley'],
  ['rocky-rhino', 'Rocky Rhino', '🦏', 'Dino Valley'], ['tiny-trike', 'Tiny Trike', '🦖', 'Dino Valley'],
  ['comet-cat', 'Comet Cat', '🐱', 'Space Station'], ['rocket-rabbit', 'Rocket Rabbit', '🐰', 'Space Station'],
  ['moon-cow', 'Moon Cow', '🐮', 'Space Station'], ['star-whale', 'Star Whale', '🐳', 'Space Station'],
  ['orbit-otter', 'Orbit Otter', '🦦', 'Space Station'], ['meteor-monkey', 'Meteor Monkey', '🐵', 'Space Station'],
  ['nova-bear', 'Nova Bear', '🐻', 'Space Station'], ['saturn-seal', 'Saturn Seal', '🦭', 'Space Station'],
  ['pumpkin-pig', 'Pumpkin Pig', '🐷', 'Pumpkin Patch'], ['apple-hedgehog', 'Apple Hedgehog', '🦔', 'Pumpkin Patch'],
  ['scarf-sheep', 'Scarf Sheep', '🐑', 'Pumpkin Patch'], ['hay-hare', 'Hay Hare', '🐇', 'Pumpkin Patch'],
  ['cocoa-bear', 'Cocoa Bear', '🐻‍❄️', 'Winter Village'], ['snowy-owl', 'Snowy Owl', '🦉', 'Winter Village'],
  ['jingle-deer', 'Jingle Deer', '🦌', 'Winter Village'], ['chaos-panda', 'Chaos Panda', '🐼', 'Finley Chaos']
].map(([id, name, icon, home]) => ({ id, name, icon, home }));

export const STICKERS = [
  ['hudson-star', 'Hudson Star', '🌟'], ['douglas-bone', 'Douglas Bone', '🦴'],
  ['forest-badge', 'Forest Badge', '🌲'], ['pirate-badge', 'Pirate Badge', '🏴‍☠️'],
  ['dino-badge', 'Dino Badge', '🦖'], ['space-badge', 'Space Badge', '🚀'],
  ['pumpkin-badge', 'Pumpkin Badge', '🎃'], ['babybell-box', 'Baby Bell Box', '📦'],
  ['finley-whirl', 'Finley Whirl', '🌪️'], ['mum-heart', 'Mum’s Heart', '💗'],
  ['dad-tools', 'Dad’s Tools', '🛠️'], ['rainbow-day', 'Rainbow Day', '🌈'],
  ['shooting-star', 'Shooting Star', '🌠'], ['snow-day', 'Snow Day', '❄️'],
  ['town-builder', 'Town Builder', '🏘️'], ['mayor-hudson', 'Mayor Hudson', '🎖️'],
  ['golden-douglas', 'Golden Douglas', '👑']
].map(([id, name, icon]) => ({ id, name, icon }));

export const BUILDINGS = [
  { id: 'home', name: 'Cosy House', icon: '🏠', needBadges: 0, color: 0xf36f5f },
  { id: 'park', name: 'Douglas Park', icon: '🌳', needBadges: 1, color: 0x40a95b },
  { id: 'library', name: 'Story Library', icon: '📚', needBadges: 1, color: 0x8b63c7 },
  { id: 'workshop', name: 'Dad’s Workshop', icon: '🛠️', needBadges: 2, color: 0x4f77bb },
  { id: 'bakery', name: 'Mum’s Bakery', icon: '🧁', needBadges: 3, color: 0xe76586 },
  { id: 'school', name: 'Explorer School', icon: '🏫', needBadges: 4, color: 0xd9862c },
  { id: 'clinic', name: 'Critter Clinic', icon: '🏥', needBadges: 5, color: 0x249989 },
  { id: 'tower', name: 'Mayor’s Tower', icon: '🏛️', needBadges: 5, color: 0xd99e19 }
];

export const DOUGLAS_SKINS = [
  { id: 'classic', name: 'Classic Douglas', icon: '🐶', needLevel: 1 },
  { id: 'scout', name: 'Forest Scout', icon: '🐶🌲', needLevel: 2 },
  { id: 'pirate', name: 'Sea Dog', icon: '🐶🏴‍☠️', needLevel: 3 },
  { id: 'space', name: 'Space Pup', icon: '🐶🚀', needLevel: 4 },
  { id: 'golden', name: 'Golden Douglas', icon: '🐶👑', needLevel: 5 }
];

export const DOUGLAS_ABILITIES = ['Happy Helper', 'Bone Sniffer', 'Treasure Tracker', 'Rocket Paws', 'Legendary Best Friend'];
