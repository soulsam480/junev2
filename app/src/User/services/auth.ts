import { api } from 'src/utils/hepers';
import { User } from 'src/User/store/useUserStore';

export function login() {}

export function googleLogin() {
  window.location.href = `${import.meta.env.VITE_API}/auth/google/`;
}

export async function getUserData() {
  return api.get<User>('/auth/user');
}
