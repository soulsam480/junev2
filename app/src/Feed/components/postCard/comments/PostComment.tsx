import React, { HTMLProps } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import { classNames, timeAgo } from 'src/utils/helpers';
import { Comment } from 'src/utils/types';

export interface ReplyCtx {
  user: string;
  id: string;
  username: string;
}
interface Props extends HTMLProps<HTMLDivElement> {
  comment: Comment;
  setReplyCtx: (ctx: ReplyCtx) => void;
  onRepliesExpand: (id: string) => any;
}

const PostComments: React.FC<Props> = ({ className, comment, setReplyCtx, onRepliesExpand }) => {
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
            <span className="font-semibold tracking-wide">{comment?.user?.username}</span> &nbsp;
            <span className="break-all">{comment?.comment} </span>
          </div>
          <div className="text-xs flex space-x-3 text-warm-gray-400">
            <span> {timeAgo(comment?.createdAt as Date)} </span>{' '}
            <span>{comment?.total_likes} likes </span>
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
                label={`${comment.total_replies} replies`}
                noBg
                dense
                sm
                onClick={() => onRepliesExpand(comment.id)}
              />
            </div>
          ) : null}
        </div>
        <div className="flex-none">
          {/* //TODO: comment like */}
          <JButton
            noBg
            icon="ion:heart"
            sm
            iconSlot={
              <>
                <span className={classNames({ hidden: false })}>
                  <JIcon icon="ion:heart" size="14px" className="fill-current text-red-700" />
                </span>
                <span className={classNames({ hidden: true })}>
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
            return <PostComment reply={reply} key={reply.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const PostComment: React.FC<{ reply: Omit<Comment, 'replies' | 'total_replies'> }> = ({
  reply,
}) => {
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
          <span className="font-semibold tracking-wide">{reply?.user?.username}</span> &nbsp;
          <span className="break-all">{reply?.comment} </span>
        </div>
        <div className="text-xs flex space-x-3 text-warm-gray-400">
          <span> {timeAgo(reply?.createdAt as Date)} </span>{' '}
          <span>{reply?.total_likes} likes </span>
        </div>
      </div>
      <div className="flex-none">
        {/* //TODO: comment like */}
        <JButton
          noBg
          icon="ion:heart"
          sm
          iconSlot={
            <>
              <span className={classNames({ hidden: false })}>
                <JIcon icon="ion:heart" size="14px" className="fill-current text-red-700" />
              </span>
              <span className={classNames({ hidden: true })}>
                <JIcon icon="ion:heart-outline" size="14px" />
              </span>
            </>
          }
        />
      </div>
    </div>
  );
};

export default PostComments;
