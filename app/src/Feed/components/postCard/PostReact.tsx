import React from 'react';
import JButton from 'src/Lib/JButton';
import { likePost, unlikePost } from 'src/Shared/services/post';
import { classNames } from 'src/utils/helpers';
import { Post } from 'src/utils/types';
import { useAlert } from 'src/Lib/store/alerts';
interface Props {
  updatePostReaction(post: Post): void;
  uid: string;
  post: Post;
}

const PostReact: React.FC<Props> = ({ updatePostReaction, uid, post }) => {
  const { setAlert } = useAlert();

  function localUnlike() {
    updatePostReaction({ id: post.id, likes: post.likes.filter((el) => el !== uid) } as Post);
  }

  function localLike() {
    updatePostReaction({ id: post.id, likes: [...post.likes, uid] } as Post);
  }

  async function handleReaction(post: Post) {
    if (post.likes.includes(uid)) {
      localUnlike();

      try {
        await unlikePost(post.id);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Some error occured !' });
        console.log(error);

        localLike();
      }
    } else {
      localLike();

      try {
        await likePost(post.id);
      } catch (error) {
        setAlert({ type: 'danger', message: 'Some error occured !' });
        console.log(error);

        localUnlike();
      }
    }
  }

  return (
    <JButton
      noBg
      icon="ion:heart"
      size="25px"
      sm
      dense
      onClick={() => handleReaction(post)}
      className={classNames([{ 'fill-current text-red-700': post.likes.includes(uid) }])}
    />
  );
};

export default PostReact;
