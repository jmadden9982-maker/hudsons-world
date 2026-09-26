import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
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
