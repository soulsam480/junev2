import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import WindiCSS from 'vite-plugin-windicss';
import PurgeIcons from 'vite-plugin-purge-icons';
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
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
