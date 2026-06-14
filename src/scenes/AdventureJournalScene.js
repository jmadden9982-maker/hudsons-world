import Phaser from 'phaser';
import SaveSystem from '../systems/SaveSystem.js';

export default class AdventureJournalScene extends Phaser.Scene {
  constructor() {
    super('AdventureJournalScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0xFBEAD0).setOrigin(0);

    this.add.text(width / 2, 45, '📖 The Adventures of Hudson', {
      fontSize: '28px',
      color: '#3b2b20',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const entries = [
      { id: 'first-jump', icon: '⭐', title: 'First Jump', text: 'Hudson helped Douglas take his very first leap.', date: 'Today' },
      { id: 'first-bone', icon: '🦴', title: 'First Bone Found', text: 'Douglas found a tasty bone in the grass.', date: 'Today' },
      { id: 'babybell', icon: '🐱', title: 'Baby Bell Found', text: 'Baby Bell surprised everyone with a big MEOW!', date: 'Today' },
      { id: 'golden-douglas', icon: '🌟', title: 'Golden Douglas', text: 'Hudson discovered the legendary Golden Douglas.', date: 'Special' }
    ];

    const favourites = SaveSystem.getJournalFavourites();

    entries.forEach((entry, i) => {
      const y = 140 + i * 160;

      this.add.rectangle(width / 2, y, 620, 130, 0xFFFFFF).setOrigin(0.5);
      this.add.text(140, y, entry.icon, { fontSize: '48px' }).setOrigin(0.5);

      this.add.text(280, y - 35, entry.title, {
        fontSize: '22px',
        color: '#3b2b20',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      this.add.text(280, y + 5, entry.text, {
        fontSize: '16px',
        color: '#5a4632',
        wordWrap: { width: 340 }
      }).setOrigin(0, 0.5);

      this.add.text(580, y + 45, entry.date, {
        fontSize: '14px',
        color: '#8d6e63'
      }).setOrigin(1, 0.5);

      const isFav = favourites.includes(entry.id);
      const fav = this.add.text(580, y - 35, isFav ? '★' : '☆', {
        fontSize: '28px',
        color: '#FFD23F'
      }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

      fav.on('pointerdown', () => {
        const newFavs = SaveSystem.toggleJournalFavourite(entry.id);
        fav.setText(newFavs.includes(entry.id) ? '★' : '☆');
      });
    });

    this.add.text(width / 2, height - 50, 'Your story is just beginning...', {
      fontSize: '18px',
      color: '#5a4632'
    }).setOrigin(0.5);
  }
}