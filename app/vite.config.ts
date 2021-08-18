import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import WindiCSS from 'vite-plugin-windicss';
import PurgeIcons from 'vite-plugin-purge-icons';
import { VitePWA } from 'vite-plugin-pwa';
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom', 'history'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4002,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom', 'history'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [
    reactRefresh(),
    WindiCSS(),
    PurgeIcons({
      included: ['ion:heart-outline', 'ion:heart'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      strategies: 'generateSW',
      workbox: {
        globIgnores: ['_redirects'],
        skipWaiting: true,
        clientsClaim: true,
        sourcemap: false,
      },
      manifest: {
        scope: '.',
        name: 'June',
        short_name: 'June',
        description: "See what's happening !",
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#BEF264',
        theme_color: '#BEF264',
        icons: [
          {
            src: '/icons/manifest-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any',
          },
          {
            src: '/icons/manifest-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
