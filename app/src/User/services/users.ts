import { api } from 'src/utils/helpers';
import { ResponseSchema } from 'src/utils/types';

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
