import create, { State } from 'zustand';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  image: string;
  token: string;
  refresh: string;
}

export type StrippedUser = Omit<User, 'refresh' | 'token'>;

export interface UserProfile extends Omit<User, 'token' | 'refresh'> {
  total_followers?: number;
  total_followings?: number;
  total_posts?: number;
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
    id: null as any,
    bio: null as any,
    email: null as any,
    image: null as any,
    name: null as any,
    username: null as any,
  },
  setLogin: (val) => set(() => ({ isLoggedIn: val })),
  setUser: (val) => set(() => ({ user: { ...val } })),
}));
