import { api } from 'src/utils/helpers';

export function searchUserWithFilters(params?: Record<string, any>) {
  return api.get('/users/search', { params: { ...params } });
}
