// windi.config.ts
import { defineConfig } from 'windicss/helpers';
import formsPlugin from 'windicss/plugin/forms';

// const COLORS = ['red', 'green', 'purple', 'indigo', 'cyan', 'amber', 'lime'];
// function generateSafeList(dat: string[]) {
//   return [
//     ...dat.map((val) => [400, 300, 50, 200].map((r) => `bg-${val}-${r}`)),
//     ...dat.map((val) => [300].map((r) => `hover:bg-${val}-${r}`)),
//   ];
// }

export default defineConfig({
  darkMode: 'class',
  // safelist: [...generateSafeList(COLORS)],
  safelist: 'fill-current text-red-700',
  theme: {
    extend: {},
    shortcuts: {},
  },
  plugins: [formsPlugin],
});
