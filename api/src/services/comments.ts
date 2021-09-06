import { DocumentDefinition } from 'mongoose';
import { Comment, commentModel, postModel, replyModel } from 'src/entities/post';
import { User, userModel } from 'src/entities/user';
import { getObjectId } from 'src/utils/helpers';

//TODO paginate
export async function getCommentsForPost(id: string, cursor: number, limit: number) {
  try {
    const baseQuery = commentModel
      .find({ post_id: id })
      .populate({
        path: 'user',
        model: User,
        select: ['name', 'username', 'id', 'image'],
      })
      .populate('total_replies')
      .select('-replies');

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

//TODO: add update and delete
export async function createCommentOnPost(id: string, comment: DocumentDefinition<Comment>) {
  try {
    const newComment = await commentModel.create({ ...comment, post_id: id });

    await postModel
      .updateOne(
        { _id: id },
        {
          $push: { comments: getObjectId(newComment._id) },
        },
      )
      .exec();

    await userModel
      .updateOne(
        { _id: getObjectId(comment.user as string) },
        { $push: { commented_posts: getObjectId(id) } },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function likeOnComment(id: string, commentId: string, userId: string) {
  try {
    await commentModel
      .updateOne(
        { _id: commentId, post_id: getObjectId(id) },
        {
          $push: { likes: getObjectId(userId) },
        },
      )
      .exec();

    await userModel
      .updateOne({ _id: userId }, { $push: { liked_comments: getObjectId(commentId) } })
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function unLikeOnComment(id: string, commentId: string, userId: string) {
  try {
    await commentModel
      .updateOne(
        { _id: commentId, post_id: getObjectId(id) },
        {
          $pull: { likes: getObjectId(userId) },
        },
      )
      .exec();

    await userModel
      .updateOne({ _id: userId }, { $pull: { liked_comments: getObjectId(commentId) } })
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

//TODO paginate
export async function getRepliesForComment(post_id: string, comment_id: string) {
  try {
    return await replyModel
      .find({ post_id, comment_id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        model: User,
        select: ['name', 'username', 'id', 'image'],
      })
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

//TODO: add update and delete
export async function createReplyOnPost(
  post_id: string,
  comment_id: string,
  reply: DocumentDefinition<Comment>,
) {
  try {
    const newReply = await replyModel.create({ ...reply, comment_id, post_id });

    await commentModel
      .updateOne(
        { _id: comment_id, post_id },
        {
          $push: { replies: getObjectId(newReply._id) },
        },
      )
      .exec();

    await userModel
      .updateOne(
        { _id: getObjectId(reply.user as string) },
        { $push: { replied_comments: getObjectId(comment_id) } },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function likeOnReply(
  post_id: string,
  comment_id: string,
  replyId: string,
  userId: string,
) {
  try {
    await replyModel
      .updateOne(
        { _id: replyId, post_id, comment_id },
        {
          $push: { likes: getObjectId(userId) },
        },
      )
      .exec();

    await userModel
      .updateOne({ _id: userId }, { $push: { liked_replies: getObjectId(replyId) } })
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function unLikeOnReply(
  post_id: string,
  comment_id: string,
  replyId: string,
  userId: string,
) {
  try {
    await replyModel
      .updateOne(
        { _id: replyId, post_id, comment_id },
        {
          $pull: { likes: getObjectId(userId) },
        },
      )
      .exec();

    await userModel
      .updateOne({ _id: userId }, { $pull: { liked_replies: getObjectId(replyId) } })
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}
