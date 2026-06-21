// On-screen error overlay — diagnostic for on-device crashes/freezes.
// Renders uncaught errors as red text the tester can screenshot, since we can't
// attach a console on the phone easily. DOM-based so it survives a Phaser/WebGL
// failure. Imported first in main.js so handlers register before anything else.
(function () {
  function el() {
    let e = document.getElementById('hw-errlog');
    if (!e) {
      e = document.createElement('div');
      e.id = 'hw-errlog';
      e.style.cssText = [
        'position:fixed', 'left:0', 'right:0', 'bottom:0', 'max-height:48%',
        'overflow:auto', 'z-index:999999', 'background:rgba(140,0,0,0.93)',
        'color:#fff', 'font:12px/1.35 monospace', 'padding:10px', 'margin:0',
        'white-space:pre-wrap', '-webkit-user-select:text', 'user-select:text'
      ].join(';');
      (document.body || document.documentElement).appendChild(e);
    }
    return e;
  }
  function show(msg) {
    try {
      const e = el();
      e.textContent += msg + '\n\n';
      e.scrollTop = e.scrollHeight;
    } catch (_) {}
  }
  window.__hwShowError = show;
  window.addEventListener('error', (ev) => {
    const stack = ev.error && ev.error.stack ? ev.error.stack : '';
    show('ERROR: ' + (ev.message || '') + '\n' + stack + (ev.filename ? ('\n@ ' + ev.filename + ':' + ev.lineno + ':' + ev.colno) : ''));
  });
  window.addEventListener('unhandledrejection', (ev) => {
    const r = ev.reason;
    show('PROMISE REJECTION: ' + (r && (r.stack || r.message) ? (r.stack || r.message) : String(r)));
  });
})();
