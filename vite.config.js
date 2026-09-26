import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';

function commitSha() {
  try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'dev'; }
}

export default defineConfig({
  base: './',
  define: {
    __BUILD_SHA__: JSON.stringify(process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : commitSha())
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Phaser is intentionally bundled for reliable offline/mobile play.
    chunkSizeWarningLimit: 1600
  },
  server: {
    port: 5173
  }
});
