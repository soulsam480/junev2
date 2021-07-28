import { api } from 'src/utils/helpers';
import { User } from 'src/User/store/useUserStore';

export interface LoginUserDto {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
}

export async function login(user: LoginUserDto) {
  return api.post<User>('/auth/login/', { user: { key: user.email, ...user } });
}

export async function register(user: LoginUserDto) {
  return api.post<User>('/auth/register/', { user: { ...user } });
}

export function googleLogin() {
  window.location.href = `${import.meta.env.VITE_API}/auth/google/`;
}

export async function getUserData() {
  return api.get<User>('/auth/user');
}
