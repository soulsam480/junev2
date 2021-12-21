import { defineConfig } from 'vite';
import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      formats: ['cjs', 'es', 'iife'],
      name: 'june',
    },
    rollupOptions: {
      treeshake: true,
      external: ['react', 'react-transition-group', 'react-dom'],
    },
  },
});
