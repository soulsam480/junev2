import { CreateQuery } from 'mongoose';
import { Post, postModel } from 'src/entities/post';
import { sanitizeResponse } from 'src/utils/helpers';

export async function createPost(post: CreateQuery<Post>) {
  try {
    const newPost = await postModel.create({ ...post });
    return { ...sanitizeResponse(newPost.toJSON()) };
  } catch (error) {
    throw error;
  }
}

export async function getAllPosts() {
  try {
    const allPosts = await postModel.find();
    return allPosts.map((post) => ({ ...sanitizeResponse(post.toJSON()) }));
  } catch (error) {
    throw error;
  }
}

export async function getPostsByUserId(id: string) {
  try {
    const allPosts = await postModel.find({ user: id });
    return allPosts.map((post) => ({ ...sanitizeResponse(post.toJSON()) }));
  } catch (error) {
    throw error;
  }
}
