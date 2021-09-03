import { DocumentDefinition } from 'mongoose';
import { Comment, commentModel, postModel } from 'src/entities/post';
import { getObjectId } from 'src/utils/helpers';

export async function getCommentsForPost(id: string) {
  try {
    const post = await postModel
      .findOne({ _id: id })
      .populate({ path: 'comments', model: Comment })
      .select(['comments'])
      .exec();

    return post?.comments;
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
      .findOne({
        _id: id,
        comments: { $elemMatch: { _id: getObjectId(commentId) } },
      })
      .populate({ path: 'comments.replies' })
      .select('comments')
      .exec();

    return post?.comments;
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
