import { CreateQuery } from 'mongoose';
import { Post, postModel } from 'src/entities/post';
import { User, userModel } from 'src/entities/user';
import { cursorPaginateResponse, getObjectId } from 'src/utils/helpers';

export async function createPost(post: CreateQuery<Post>) {
  try {
    return await postModel.create({ ...post });
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getAllPosts(cursor: number, limit: number) {
  try {
    return await cursorPaginateResponse(
      postModel
        .find()
        .populate({ path: 'user', model: User, select: ['username', 'id', 'name', 'image'] }),
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
    const allPosts = await postModel.find({ user: id }).exec();
    return allPosts;
  } catch (error) {
    Promise.reject(error);
  }
}

export async function reactPost(id: string, userId: string) {
  try {
    const isLiked = await postModel
      .findOne({
        _id: id,
        likes: { $in: [getObjectId(userId)] },
      })
      .select(['id'])
      .exec();

    if (!isLiked) {
      await postModel.updateOne({ _id: id }, { $push: { likes: getObjectId(userId) } }).exec();

      await userModel
        .updateOne({ _id: userId }, { $push: { liked_posts: getObjectId(id) } })
        .exec();
    } else {
      await postModel.updateOne({ _id: id }, { $pull: { likes: getObjectId(userId) } }).exec();

      await userModel
        .updateOne({ _id: userId }, { $pull: { liked_posts: getObjectId(id) } })
        .exec();
    }

    return await postModel
      .findOne({
        _id: id,
      })
      .select(['likes', 'total_likes', 'id', 'updatedAt'])
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}
