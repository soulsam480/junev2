## Furikaeru component library

> A minimal component lib for personal projects
![npm](https://img.shields.io/npm/v/@soulsam480/june) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@soulsam480/june) ![GitHub](https://img.shields.io/github/license/soulsam480/@soulsam480/june) ![npm](https://img.shields.io/npm/dm/@soulsam480/june)

#### Features
- Tree shaked
- Style via WIndicss/Tailwind
- Icons powered by @antfu/vite-plugin-purge-icons (opt in only for vite apps) 

#### Based on 
- React 
- Vite
- WindiCSS/Tailwind
- TypeScript
- Iconify

#### Usage
> please don't skip following steps
__install__

```
yarn add @soulsam480/june
npm install @soulsam480/june
pnpm add @soulsam480/june
```
__install peer dependencies__
- react
- react-transition-group
- tailwind

if you want to use icons (only for vite)
- @iconify/iconify@latest
- @iconify/json@latest
- vite-plugin-purge-icons@latest
and config in vite config

__config__

- add to windi/tailiwnd config
```ts
import { JuneTWindSafelist } from '@soulsam480/june'
{
  safelist: [...JuneTWindSafelist],
  extract: { include: ['./node_modules/@soulsam480/june/dist/*'] },
};
```
- import CSS 
```ts
import '@soulsam480/june/dist/style.css';
```

#### Caution
even after doing all these, there might be some issues, I'm advising not use this for your projects. Thx