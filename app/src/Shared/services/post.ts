import { api } from 'src/utils/helpers';
import { PaginationParams, Post, ResponseSchema } from 'src/utils/types';

export async function createPost(params: { content: string }) {
  return api.post<ResponseSchema<Post>>('/posts/', { post: { ...params } });
}

export function getAllPosts(opts: PaginationParams) {
  return api.get<ResponseSchema<Post[]>>('/posts', { params: { ...opts } });
}
