import create, { State } from 'zustand';

export interface User {
  name: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
  token: string | null;
  refresh: string;
}

export interface UserState extends State {
  isLoggedIn: boolean;
  user: Omit<User, 'refresh' | 'token'>;
  setLogin: (val: boolean) => void;
  setUser: (val: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  user: {
    bio: null,
    email: null,
    image: null,
    name: null,
    username: null,
  },
  setLogin: (val) => set(() => ({ isLoggedIn: val })),
  setUser: (val) => set(() => ({ user: { ...val } })),
}));
