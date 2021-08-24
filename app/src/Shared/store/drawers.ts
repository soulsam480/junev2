import create, { State } from 'zustand';

interface Drawers {
  isUserDrawer: boolean;
}

export interface LoaderState extends State {
  drawerState: Drawers;
  setDrawer: (key: keyof Drawers, payload: boolean) => void;
}

export const useDrawers = create<LoaderState>((set, get) => ({
  drawerState: { isUserDrawer: false },
  setDrawer: (key, payload) => {
    set({ drawerState: { ...get().drawerState, [key]: payload } });
  },
}));
