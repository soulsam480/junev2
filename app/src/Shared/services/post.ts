import { api } from 'src/utils/helpers';
import { Post } from 'src/utils/types';

export interface ResponseSchema<T = any> {
  data: T;
}

export async function createPost(params: { content: string }) {
  return api.post<ResponseSchema<Post>>('/posts/', { post: { ...params } });
}

export function getAllPosts() {
  return api.get<ResponseSchema<Post[]>>('/posts');
}
