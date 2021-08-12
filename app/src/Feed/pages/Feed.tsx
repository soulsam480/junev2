import React, { useEffect, useState } from 'react';
import PostCard from 'src/Feed/components/PostCard';
import JButton from 'src/Lib/JButton';
import { getAllPosts } from 'src/Shared/services/post';
import { usePaginatedQuery } from 'src/utils/hooks';
import { Post } from 'src/utils/types';
import AppPostEditor from 'src/Shared/components/PostEditor';
import { createPost } from 'src/Shared/services/post';

interface Props {}

const MemoizedPostCard = React.memo(PostCard);

const Test: React.FC<Props> = () => {
  const { data, validate } = usePaginatedQuery<Post, any>([], getAllPosts, {
    initialPage: 0,
    limit: 5,
  });

  const [editorData, setEditorData] = useState('');

  async function savePost() {
    try {
      const {
        data: { data },
      } = await createPost({ content: editorData });
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
      <div className="pb-3 flex flex-col space-y-2">
        <div className="flex justify-end flex-col items-end space-y-2">
          <AppPostEditor
            value={editorData}
            setValue={setEditorData}
            placeholder="Create a post"
            className="w-full h-full"
            onPost={savePost}
          />
        </div>
      </div>
      <div className="flex flex-col items-start space-y-3 pb-15">
        {data?.map((post) => (
          <MemoizedPostCard key={post.id} post={post} />
        ))}
        <div className="flex justify-center w-full">
          <JButton label="Load more" onClick={validate} flat />
        </div>
      </div>
    </>
  );
};

export default Test;
