import create, { State } from 'zustand';

interface Drawers {
  isUserDrawer: boolean;
}

export interface DrawerState extends State {
  drawerState: Drawers;
  setDrawer: (key: keyof Drawers, payload: boolean) => void;
}

export const useDrawers = create<DrawerState>((set, get) => ({
  drawerState: { isUserDrawer: false },
  setDrawer: (key, payload) => {
    set({ drawerState: { ...get().drawerState, [key]: payload } });
  },
}));
