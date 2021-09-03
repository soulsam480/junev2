import { api } from 'src/utils/helpers';
import { Comment, PaginationParams, Post, ResponseSchema } from 'src/utils/types';

export async function createPost(params: { content: string }) {
  return api.post<ResponseSchema<Post>>('/posts/', { post: { ...params } });
}

export function getAllPosts(opts: PaginationParams) {
  return api.get<ResponseSchema<Post[]>>('/posts/', { params: { ...opts } });
}

export function likePost(id: string) {
  return api.post(`/posts/${id}/like/`);
}

export function unlikePost(id: string) {
  return api.post(`/posts/${id}/unlike/`);
}

export async function archivePost(id: string, is_archived: boolean) {
  return api.patch(`/posts/${id}/`, { is_archived });
}

export async function deletePost(id: string) {
  return api.delete(`/posts/${id}/`);
}

export async function updatePost(id: string, post: Partial<Post>) {
  return api.patch(`/posts/${id}/`, { ...post });
}

export async function getPost(id: string) {
  return api.get<ResponseSchema<Post>>(`/posts/${id}/`);
}

export async function getPostComments(id: string) {
  return api.get<ResponseSchema<Comment[]>>(`/posts/${id}/comments`);
}

export async function createCommentOnPost(id: string, comment: Comment) {
  return api.post(`/posts/${id}/comments/`, { comment });
}
