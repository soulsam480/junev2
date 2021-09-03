import React, { HTMLProps } from 'react';
import JAvatar from 'src/Lib/JAvatar';
import JButton from 'src/Lib/JButton';
import JIcon from 'src/Lib/JIcon';
import { classNames } from 'src/utils/helpers';
import { Comment } from 'src/utils/types';

interface Props extends HTMLProps<HTMLDivElement> {
  comment?: Comment;
}

const PostComments: React.FC<Props> = ({ className, comment }) => {
  return (
    <div className={classNames(['flex space-x-2 items-center', className || ''])}>
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
        <div className="flex text-xs space-x-1 items-center">
          <div className="flex-none font-medium">{comment?.user?.username} </div>
          <div className="flex-grow">{comment?.comment}</div>
        </div>
        <div className="text-xs flex space-x-3 text-warm-gray-400">
          <span>time</span> <span>{comment?.total_likes} likes </span> <span>reply</span>
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
