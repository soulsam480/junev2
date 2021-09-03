import { DocumentDefinition, UpdateQuery } from 'mongoose';
import { Post, postModel } from 'src/entities/post';
import { User, userModel } from 'src/entities/user';
import { cursorPaginateResponse, getObjectId } from 'src/utils/helpers';

export async function createPost(post: DocumentDefinition<Post>) {
  try {
    const newPost = await postModel.create({ ...post });

    return await newPost
      .populate({
        path: 'user',
        model: 'User',
        select: ['username', 'id', 'name', 'image'],
      })
      .execPopulate();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getAllPosts(cursor: number, limit: number) {
  const baseQuery = postModel
    .find({ is_archived: false })
    .populate({ path: 'user', model: User, select: ['username', 'id', 'name', 'image'] })
    .sort({ createdAt: -1 });

  try {
    return await cursorPaginateResponse(
      baseQuery,
      cursor,
      limit,
      await baseQuery.estimatedDocumentCount(),
    );
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getPostsByUserId(id: string) {
  try {
    const allPosts = await postModel.find({ user: id, is_archived: false }).exec();
    return allPosts;
  } catch (error) {
    Promise.reject(error);
  }
}

export async function likePost(id: string, userId: string) {
  try {
    await postModel.updateOne({ _id: id }, { $push: { likes: getObjectId(userId) } }).exec();

    await userModel.updateOne({ _id: userId }, { $push: { liked_posts: getObjectId(id) } }).exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function unlikePost(id: string, userId: string) {
  try {
    await postModel.updateOne({ _id: id }, { $pull: { likes: getObjectId(userId) } }).exec();

    await userModel.updateOne({ _id: userId }, { $pull: { liked_posts: getObjectId(id) } }).exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function updatePostById(id: string, userId: string, post: UpdateQuery<Post>) {
  try {
    await postModel.updateOne({ _id: id, user: userId }, { ...post }).exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getPostById(id: string) {
  try {
    return await postModel
      .findOne({ _id: id, is_archived: false })
      .populate({ path: 'user', model: User, select: ['username', 'id', 'name', 'image'] })
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function deletePostById(id: string, user: string) {
  try {
    return await postModel.findOneAndDelete({ _id: id, user }).exec();
  } catch (error) {
    Promise.reject(error);
  }
}
