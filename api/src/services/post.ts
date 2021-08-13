import { mongoose } from '@typegoose/typegoose';
import { CreateQuery } from 'mongoose';
import { Post, postModel } from 'src/entities/post';
import { User } from 'src/entities/user';
import { cursorPaginateResponse, sanitizeResponse } from 'src/utils/helpers';

export async function createPost(post: CreateQuery<Post>) {
  try {
    const newPost = await postModel.create({ ...post });
    return { ...sanitizeResponse(newPost.toJSON()) };
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getAllPosts(cursor: number, limit: number) {
  try {
    return await cursorPaginateResponse(
      postModel.find().populate({ path: 'user', model: User, select: ['username', 'id', 'name'] }),
      cursor,
      limit,
      await postModel.estimatedDocumentCount(),
    );
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getPostsByUserId(id: string) {
  try {
    const allPosts = await postModel.find({ user: id });
    return allPosts.map((post) => ({ ...sanitizeResponse(post.toJSON()) }));
  } catch (error) {
    Promise.reject(error);
  }
}

export async function reactPost(id: string, userId: string) {
  try {
    const isLiked = await postModel.find({
      _id: id,
      likes: { $in: [new mongoose.Types.ObjectId(userId)] },
    });

    if (!isLiked.length) {
      await postModel.updateOne(
        { _id: id },
        { $push: { likes: new mongoose.Types.ObjectId(userId) } },
      );
    } else {
      await postModel.updateOne(
        { _id: id },
        { $pull: { likes: new mongoose.Types.ObjectId(userId) } },
      );
    }

    const updated = await postModel
      .find({
        _id: id,
      })
      .populate({ path: 'user', model: User, select: ['username', 'id', 'name'] });

    return { ...sanitizeResponse(updated[0].toJSON()) };
  } catch (error) {
    Promise.reject(error);
  }
}
