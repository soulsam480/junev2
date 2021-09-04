import { DocumentDefinition } from 'mongoose';
import { Comment, commentModel, postModel } from 'src/entities/post';
import { User } from 'src/entities/user';
import { getObjectId } from 'src/utils/helpers';

export async function getCommentsForPost(id: string) {
  try {
    const post = await postModel
      .findOne({ _id: id }, 'comments')
      .populate({ path: 'comments.user', model: User, select: ['name', 'username', 'id', 'image'] })
      .exec();

    return post
      ?.toObject({ flattenMaps: true, virtuals: true })
      .comments?.map((el) => ({ ...el, replies: null }));
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
      .populate({ path: 'comments.replies', model: Comment })
      .populate({
        path: 'comments.replies.user',
        model: User,
        select: ['name', 'username', 'id', 'image'],
      })
      .exec();

    if (!post) return [];

    return (post?.toObject({ flattenMaps: true, virtuals: true }).comments as Comment[])[0].replies;
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
