import React, { useEffect } from 'react';
import PostCard from 'src/Feed/components/PostCard';
import JButton from 'src/Lib/JButton';
import { getAllPosts } from 'src/Shared/services/post';
import { usePaginatedQuery } from 'src/utils/hooks';
import { Post } from 'src/utils/types';

interface Props {}

const MemoizedPostCard = React.memo(PostCard);

const Test: React.FC<Props> = () => {
  const { data, validate } = usePaginatedQuery<Post, any>([], getAllPosts, {
    initialPage: 0,
    limit: 5,
  });

  useEffect(() => {
    (async () => await validate())();
  }, []);

  return (
    <>
      <div className="flex flex-col items-start space-y-3 pb-15">
        {data?.map((post) => (
          <MemoizedPostCard key={post.id} post={post} />
        ))}
        <JButton label="more" onClick={validate} />
      </div>
    </>
  );
};

export default Test;
