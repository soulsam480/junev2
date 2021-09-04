import React, { HTMLProps, memo, useMemo } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import { classNames, timeAgo } from 'src/utils/helpers';
import { Comment, Reply } from 'src/utils/types';
import { useComment } from 'src/Feed/context/commentApi';
import { likeComment, likeReply, unLikeComment, unLikeReply } from 'src/Shared/services/post';
import { useUserStore } from 'src/User/store/useUserStore';
import { useAlert } from 'src/Lib/store/alerts';

export interface ReplyCtx {
  user: string;
  id: string;
  username: string;
}
interface Props extends HTMLProps<HTMLDivElement> {
  comment: Comment;
}

const PostComment: React.FC<Props> = ({ className, comment }) => {
  const { onRepliesExpand, setReplyCtx, postId, updateCommentReaction } = useComment();

  const userId = useUserStore((s) => s.user.id);

  const setAlert = useAlert((state) => state.setAlert);

  function localUnlike() {
    updateCommentReaction({
      id: comment.id,
      likes: comment?.likes.filter((el) => el !== userId),
    } as Comment);
  }

  function localLike() {
    updateCommentReaction({ id: comment.id, likes: [...comment?.likes, userId] } as Comment);
  }

  async function handleReaction(comment: Comment) {
    if (comment.likes.includes(userId)) {
      localUnlike();

      try {
        await unLikeComment(postId, comment.id);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Some error occured !' });
        console.log(error);

        localLike();
      }
    } else {
      localLike();

      try {
        await likeComment(postId, comment.id);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Some error occured !' });
        console.log(error);

        localUnlike();
      }
    }
  }

  const getTimeAgo = useMemo(() => timeAgo, []);

  return (
    <div className={classNames(['flex-col space-y-2', className || ''])}>
      <div className="flex space-x-2 items-start">
        <div className="flex-none">
          <JAvatar
            src={comment?.user?.image}
            content={!comment?.user?.image ? comment?.user?.username.slice(0, 2) : undefined}
            contentClass="bg-lime-200 shadow-sm"
            rounded
            size="35px"
            iconSize="15px"
          />
        </div>
        <div className="flex-col flex-grow">
          <div className="text-xs">
            <span className="tracking-wide">
              <b>{comment?.user?.username}</b>
            </span>{' '}
            &nbsp;
            <span className="break-all">{comment?.comment} </span>
          </div>
          <div className="text-xs flex items-center space-x-3 text-warm-gray-400">
            <span> {getTimeAgo(comment?.createdAt as Date)} </span>{' '}
            <span>
              {comment.total_likes} {comment.total_likes > 1 ? 'likes' : 'like'}{' '}
            </span>
            <JButton
              label="reply"
              dense
              noBg
              onClick={() =>
                setReplyCtx({
                  id: comment.id,
                  user: comment.user.id,
                  username: comment.user.username,
                })
              }
              title={`reply to ${comment.user.username}`}
            />
          </div>
          {!comment.replies && comment.total_replies ? (
            <div className="text-warm-gray-500">
              <JButton
                label={`${comment.total_replies} ${
                  comment.total_replies > 1 ? 'replies' : 'reply'
                }`}
                noBg
                dense
                sm
                onClick={() => onRepliesExpand(comment.id)}
              />
            </div>
          ) : null}
        </div>
        <div className="flex-none">
          <JButton
            noBg
            sm
            onClick={() => handleReaction(comment)}
            iconSlot={
              <>
                <span className={classNames({ hidden: !comment.likes?.includes(userId) })}>
                  <JIcon icon="ion:heart" size="14px" className="fill-current text-red-700" />
                </span>
                <span className={classNames({ hidden: comment.likes?.includes(userId) })}>
                  <JIcon icon="ion:heart-outline" size="14px" />
                </span>
              </>
            }
          />
        </div>
      </div>
      <div className="flex">
        <div className="flex-col flex-grow space-y-2 ml-[40px]">
          {comment.replies?.map((reply) => {
            return <MemoizedPostComment reply={reply} key={reply.id} commentId={comment.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const PostReply: React.FC<{
  reply: Reply;
  commentId: string;
}> = ({ reply, commentId }) => {
  const { updateReplyReaction, postId, onRepliesExpand } = useComment();

  const getTimeAgo = useMemo(() => timeAgo, []);

  const userId = useUserStore((s) => s.user.id);

  const setAlert = useAlert((state) => state.setAlert);

  function localUnlike() {
    updateReplyReaction(commentId, {
      id: reply.id,
      likes: reply?.likes.filter((el) => el !== userId),
    } as Reply);
  }

  function localLike() {
    updateReplyReaction(commentId, { id: reply.id, likes: [...reply?.likes, userId] } as Reply);
  }

  async function handleReaction(reply: Reply) {
    if (reply.likes.includes(userId)) {
      localUnlike();

      try {
        await unLikeReply(postId, commentId, reply.id);

        onRepliesExpand(commentId);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Some error occured !' });
        console.log(error);

        localLike();
      }
    } else {
      localLike();

      try {
        await likeReply(postId, commentId, reply.id);

        onRepliesExpand(commentId);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Some error occured !' });
        console.log(error);

        localUnlike();
      }
    }
  }

  return (
    <div className={classNames(['flex space-x-2 items-start'])}>
      <div className="flex-none">
        <JAvatar
          src={reply?.user?.image}
          content={!reply?.user?.image ? reply?.user?.username.slice(0, 2) : undefined}
          contentClass="bg-lime-200 shadow-sm"
          rounded
          size="35px"
          iconSize="15px"
        />
      </div>
      <div className="flex-col flex-grow">
        <div className="text-xs">
          <span className="tracking-wide">
            <b>{reply?.user?.username}</b>
          </span>{' '}
          &nbsp;
          <span className="break-all">{reply?.comment} </span>
        </div>
        <div className="text-xs flex space-x-3 text-warm-gray-400">
          <span> {getTimeAgo(reply?.createdAt as Date)} </span>{' '}
          <span>{reply?.total_likes} likes </span>
        </div>
      </div>
      <div className="flex-none">
        <JButton
          noBg
          sm
          onClick={() => handleReaction(reply)}
          iconSlot={
            <>
              <span className={classNames({ hidden: !reply.likes?.includes(userId) })}>
                <JIcon icon="ion:heart" size="14px" className="fill-current text-red-700" />
              </span>
              <span className={classNames({ hidden: reply.likes?.includes(userId) })}>
                <JIcon icon="ion:heart-outline" size="14px" />
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

const MemoizedPostComment = memo(PostReply);

export default PostComment;
