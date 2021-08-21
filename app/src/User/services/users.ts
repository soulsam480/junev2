import { api } from 'src/utils/helpers';
import { Post, ResponseSchema } from 'src/utils/types';
import { UserProfile } from 'src/User/store/useUserStore';

export interface SearchUserResponse {
  username: string;
  id: string;
  name: string;
}

export function searchUserWithFilters(params?: Record<string, any>) {
  return api.get<ResponseSchema<SearchUserResponse[]>>('/users/search', {
    params: { ...params },
  });
}

export function getUserProfileByUsername(username: string) {
  return api.get<ResponseSchema<UserProfile>>(`/users/${username}`);
}

export function getUserPostsById(id: string) {
  return api.get<ResponseSchema<Post[]>>(`users/${id}/posts`);
}
