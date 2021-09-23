import { api } from 'src/utils/helpers';
import {
  PaginationParams,
  Post,
  ResponseSchema,
  UpdatePassword,
  UpdateUserData,
} from 'src/utils/types';
import { User, UserProfile } from 'src/User/store/useUserStore';

export interface SearchUserResponse {
  username: string;
  id: string;
  name: string;
}

export function searchUserWithFilters(params?: Record<string, any>) {
  return api.get<ResponseSchema<SearchUserResponse[]>>('/users/search/', {
    params: { ...params },
  });
}

export function getUserProfileByUsername(username: string) {
  return api.get<ResponseSchema<UserProfile>>(`/users/${username}/`);
}

export function getUserPostsById(id: string, opts: PaginationParams) {
  return api.get<ResponseSchema<Post[]>>(`/users/${id}/posts/`, { params: { ...opts } });
}

export function updateUserById(id: string, userData: UpdateUserData) {
  return api.patch<ResponseSchema<User>>(`/users/${id}`, { ...userData });
}
export function updateUserPassword(id: string, passwords: UpdatePassword) {
  return api.post<ResponseSchema<User>>(`/users/${id}/password`, { ...passwords });
}

export function uploadImage(file: any) {
  return api.post<ResponseSchema<User>>(`/cdn`, file);
}
