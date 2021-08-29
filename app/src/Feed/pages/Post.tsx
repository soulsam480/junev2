import React from 'react';
import { useParams } from 'react-router-dom';

interface Props {}

const Post: React.FC<Props> = () => {
  const { postId, username } = useParams();
  return (
    <div>
      {' '}
      {postId} of {username}{' '}
    </div>
  );
};

export default Post;
