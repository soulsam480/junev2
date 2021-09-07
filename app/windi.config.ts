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

function generateShades(color: string, type: 'text' | 'bg', shaderange: number) {
  return [...Array(shaderange).keys()]
    .map((e) => !!e && `${type}-${color}-${e * 100}`)
    .filter((x) => typeof x === 'string');
}

export default defineConfig({
  darkMode: 'class',
  safelist: ['fill-current text-red-700', generateShades('lime', 'text', 10)],
  theme: {
    extend: {},
    shortcuts: {},
  },
  plugins: [formsPlugin],
});
