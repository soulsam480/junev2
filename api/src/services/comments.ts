import { DocumentDefinition } from 'mongoose';
import { Comment, commentModel, postModel } from 'src/entities/post';
import { User } from 'src/entities/user';
import { getObjectId } from 'src/utils/helpers';

//TODO paginate
export async function getCommentsForPost(id: string) {
  try {
    const post = await postModel
      .findOne({ _id: id })
      .populate({ path: 'comments', options: { sort: { createdAt: -1 } } })
      .populate({ path: 'comments.user', model: User, select: ['name', 'username', 'id', 'image'] })
      .exec();

    return post
      ?.toObject({ flattenMaps: true, virtuals: true })
      .comments?.map((el) => ({ ...el, replies: null }))
      .sort((a, b) => ((a as any).createdAt < (b as any).createdAt ? 1 : -1));
  } catch (error) {
    Promise.reject(error);
  }
}

//TODO: add update and delete
export async function createCommentOnPost(id: string, comment: DocumentDefinition<Comment>) {
  try {
    const newComment = await commentModel.create({ ...comment });

    await postModel
      .updateOne(
        { _id: id },
        {
          $push: { comments: newComment },
        },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function likeOnComment(id: string, commentId: string, userId: string) {
  try {
    await postModel
      .updateOne(
        { _id: id, 'comments._id': getObjectId(commentId) },
        {
          $push: { 'comments.$[el].likes': getObjectId(userId) },
        },
        {
          arrayFilters: [
            {
              'el._id': getObjectId(commentId),
            },
          ],
        },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function unLikeOnComment(id: string, commentId: string, userId: string) {
  try {
    await postModel
      .updateOne(
        { _id: id, 'comments._id': getObjectId(commentId) },
        {
          $pull: { 'comments.$[el].likes': getObjectId(userId) },
        },
        {
          arrayFilters: [
            {
              'el._id': getObjectId(commentId),
            },
          ],
        },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

//TODO paginate
export async function getRepliesForComment(id: string, commentId: string) {
  try {
    const post = await postModel
      .findOne(
        {
          _id: id,
          'comments._id': getObjectId(commentId),
        },
        { comments: { $elemMatch: { _id: getObjectId(commentId) } } },
      )
      .populate({
        path: 'comments.replies',
      })
      .populate({
        path: 'comments.replies.user',
        model: User,
        select: ['name', 'username', 'id', 'image'],
      })
      .sort({ 'comments.replies.createdAt': 1 })
      .exec();

    if (!post) return [];

    return (
      post?.toObject({ flattenMaps: true, virtuals: true }).comments as Comment[]
    )[0].replies?.sort((a, b) => ((a as any).createdAt < (b as any).createdAt ? 1 : -1));
  } catch (error) {
    Promise.reject(error);
  }
}

//TODO: add update and delete
export async function createReplyOnPost(
  id: string,
  commentId: string,
  reply: DocumentDefinition<Comment>,
) {
  try {
    const newReply = await commentModel.create({ ...reply });

    await postModel.updateOne(
      { _id: id },
      {
        $push: {
          'comments.$[el].replies': newReply,
        },
      },
      {
        arrayFilters: [
          {
            'el._id': getObjectId(commentId),
          },
        ],
      },
    );
  } catch (error) {
    Promise.reject(error);
  }
}

export async function likeOnReply(id: string, commentId: string, replyId: string, userId: string) {
  try {
    await postModel
      .updateOne(
        { _id: id },
        {
          $push: {
            'comments.$[c].replies.$[d].likes': getObjectId(userId),
          },
        },
        {
          arrayFilters: [
            {
              'c._id': getObjectId(commentId),
            },
            {
              'd._id': getObjectId(replyId),
            },
          ],
        },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}

export async function unLikeOnReply(
  id: string,
  commentId: string,
  replyId: string,
  userId: string,
) {
  try {
    await postModel
      .updateOne(
        { _id: id },
        {
          $pull: {
            'comments.$[c].replies.$[d].likes': getObjectId(userId),
          },
        },
        {
          arrayFilters: [
            {
              'c._id': getObjectId(commentId),
            },
            {
              'd._id': getObjectId(replyId),
            },
          ],
        },
      )
      .exec();
  } catch (error) {
    Promise.reject(error);
  }
}
