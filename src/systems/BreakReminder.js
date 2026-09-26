import { S } from './state.js';

let startedAt = Date.now();
let installed = false;

const BreakReminder = {
  install() {
    if (installed) return; installed = true;
    window.setInterval(() => {
      if (!S.settings.breakReminder) { startedAt = Date.now(); return; }
      const minutes = (Date.now() - startedAt) / 60000;
      if (minutes < (S.settings.breakMinutes || 20) || document.getElementById('hudson-break')) return;
      const box = document.createElement('div'); box.id = 'hudson-break';
      box.innerHTML = `<div><span>🌳</span><h2>Adventure stretch?</h2><p>A wiggle, drink or little rest might feel good. Keep playing whenever you are ready.</p><button>READY TO PLAY</button></div>`;
      box.querySelector('button').addEventListener('click', () => { startedAt = Date.now(); box.remove(); });
      document.body.appendChild(box);
    }, 30000);
  }
};

export default BreakReminder;
