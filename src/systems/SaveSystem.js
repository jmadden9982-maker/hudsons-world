const SaveSystem = {
  // Core save/load
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Save failed for', key);
    }
  },

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  // Critical Progress
  getStars() {
    return this.load('stars', 0);
  },
  addStars(amount) {
    const current = this.getStars();
    this.save('stars', current + amount);
    return current + amount;
  },

  getHighScore() {
    return this.load('douglasDashHighScore', 0);
  },
  setHighScore(score) {
    const current = this.getHighScore();
    if (score > current) {
      this.save('douglasDashHighScore', score);
      return score;
    }
    return current;
  },

  getCurrentOutfit() {
    return this.load('currentOutfit', 'everyday');
  },
  setCurrentOutfit(outfitId) {
    this.save('currentOutfit', outfitId);
  },

  getGoldenDouglasFound() {
    return this.load('goldenDouglasFound', false);
  },
  setGoldenDouglasFound() {
    this.save('goldenDouglasFound', true);
  },

  getBabyBellCount() {
    return this.load('babyBellCount', 0);
  },
  incrementBabyBellCount() {
    const current = this.getBabyBellCount();
    this.save('babyBellCount', current + 1);
    return current + 1;
  },

  // Daily Reward
  getLastDailyReward() {
    return this.load('lastDailyReward', null);
  },
  setLastDailyReward(dateStr) {
    this.save('lastDailyReward', dateStr);
  },

  getStreak() {
    return this.load('streak', 0);
  },
  setStreak(value) {
    this.save('streak', value);
  },

  // Journal
  getJournalFavourites() {
    return this.load('journalFavourites', []);
  },
  toggleJournalFavourite(entryId) {
    const favs = this.getJournalFavourites();
    const index = favs.indexOf(entryId);
    if (index === -1) favs.push(entryId);
    else favs.splice(index, 1);
    this.save('journalFavourites', favs);
    return favs;
  },

  // Reset all data (for testing)
  resetAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('stars') || 
          key.startsWith('douglas') || 
          key.startsWith('currentOutfit') || 
          key.startsWith('golden') || 
          key.startsWith('babyBell') || 
          key.startsWith('lastDaily') || 
          key.startsWith('streak') || 
          key.startsWith('journal')) {
        localStorage.removeItem(key);
      }
    });
  }
};

window.SaveSystem = SaveSystem;
export default SaveSystem;