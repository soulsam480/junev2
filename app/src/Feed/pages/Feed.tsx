import React, { useEffect } from 'react';
import PostCard from 'src/Feed/components/PostCard';
import { getAllPosts } from 'src/Shared/services/post';
import { useQuery } from 'src/utils/hooks';

interface Props {}

const Test: React.FC<Props> = () => {
  const { data, isLoading, validate } = useQuery({ data: [] }, () => getAllPosts());

  useEffect(() => {
    validate();
  }, []);

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-col items-start space-y-3 pb-15">
          {data?.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        'Loading'
      )}
    </>
  );
};

export default Test;
