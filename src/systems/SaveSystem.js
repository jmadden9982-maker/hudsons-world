const SaveSystem = {
  save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { console.warn('Hudson’s World could not save:', error); return false; }
  },
  load(key, fallback = null) {
    try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
    catch { return fallback; }
  },
  remove(key) { try { localStorage.removeItem(key); } catch { /* storage unavailable */ } }
};

export default SaveSystem;
