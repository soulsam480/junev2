import React, { HTMLProps } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import { classNames, timeAgo } from 'src/utils/helpers';
import { Comment } from 'src/utils/types';

interface Props extends HTMLProps<HTMLDivElement> {
  comment?: Comment;
}

const PostComments: React.FC<Props> = ({ className, comment }) => {
  return (
    <div className={classNames(['flex space-x-2 items-start', className || ''])}>
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
          <span>{comment?.total_likes} likes </span> <span>reply</span>
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
