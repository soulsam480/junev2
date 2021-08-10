import React, { useEffect } from 'react';
import PostCard from 'src/Feed/components/PostCard';
import JButton from 'src/Lib/JButton';
import { getAllPosts } from 'src/Shared/services/post';
import { searchUserWithFilters } from 'src/User/services/users';
import { usePaginatedQuery } from 'src/utils/hooks';
import { Post } from 'src/utils/types';

interface Props {}

const MemoizedPostCard = React.memo(PostCard);

const Test: React.FC<Props> = () => {
  const { data, validate } = usePaginatedQuery<Post, any>([], getAllPosts, {
    initialPage: 0,
    limit: 5,
  });

  async function searchUser() {
    try {
      const { data } = await searchUserWithFilters({ username: 'sambitsaho', name: 'sambit' });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

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
        <JButton label="test" onClick={searchUser} />
      </div>
    </>
  );
};

export default Test;
