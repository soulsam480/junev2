import create, { State } from 'zustand';

export interface LoaderState extends State {
  isLoader: boolean;
  setLoader: (payload: boolean) => void;
}

export const useLoader = create<LoaderState>((set, get) => ({
  isLoader: false,
  setLoader: (payload) => {
    set({ isLoader: payload });
  },
}));
