import { api } from 'src/utils/helpers';
import { Post } from 'src/utils/types';

export interface ResponseSchema<T = any> {
  data: T;
  current_page?: number;
  total_count?: number;
  total_pages?: number;
}

export interface PaginationParams {
  page: number;
  limit?: number;
}

export async function createPost(params: { content: string }) {
  return api.post<ResponseSchema<Post>>('/posts/', { post: { ...params } });
}

export function getAllPosts(opts: PaginationParams) {
  return api.get<ResponseSchema<Post[]>>('/posts', { params: { ...opts } });
}
