function showFriendlyError(message) {
  if (document.getElementById('hudson-error')) return;
  const overlay = document.createElement('div');
  overlay.id = 'hudson-error';
  overlay.innerHTML = `
    <div class="hudson-error-card">
      <div class="hudson-error-icon">🐶</div>
      <h2>Douglas found a wobbly bit</h2>
      <p>The adventure paused safely. Your saved progress is still here.</p>
      <button type="button">RETURN TO HUDSON’S WORLD</button>
      <details><summary>Grown-up details</summary><pre></pre></details>
    </div>`;
  overlay.querySelector('pre').textContent = String(message || 'Unknown game error').slice(0, 1800);
  overlay.querySelector('button').addEventListener('click', () => window.location.reload());
  document.body.appendChild(overlay);
}

window.addEventListener('error', (event) => showFriendlyError(event.error?.stack || event.message));
window.addEventListener('unhandledrejection', (event) => showFriendlyError(event.reason?.stack || event.reason));
window.__hudsonShowError = showFriendlyError;
