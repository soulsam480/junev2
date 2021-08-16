import React, { useEffect } from 'react';
import JButton from 'src/Lib/JButton';
import { likePost } from 'src/Shared/services/post';
import { classNames } from 'src/utils/helpers';
import { useQuery } from 'src/utils/hooks';
import { Post, ResponseSchema } from 'src/utils/types';

interface Props {
  updatePostReaction: (post: Post) => void;
  uid: string;
  post: Post;
}

const PostReact: React.FC<Props> = ({ updatePostReaction, uid, post }) => {
  const { isLoading, validate, error } = useQuery<ResponseSchema<Post>, [string]>(
    { data: {} as any } as any,
    (args) => likePost(args[0]),
  );

  async function handleReaction() {
    const { data: res } = await validate(post.id);
    updatePostReaction(res);
  }

  useEffect(() => {
    if (!!error) {
      console.log('some error');
    }
  }, [error]);

  return (
    <JButton
      noBg
      icon="ion:heart"
      size="25px"
      sm
      dense
      onClick={handleReaction}
      loading={isLoading}
      className={classNames([{ 'fill-current text-red-700': post.likes.includes(uid) }])}
    />
  );
};

export default PostReact;
