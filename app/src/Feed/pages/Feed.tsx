import React, { useCallback, useEffect, useState } from 'react';
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
  const { data, validate, isEnd, forceValidate } = usePaginatedQuery<Post, any>([], getAllPosts, {
    limit: 5,
  });

  const [editorData, setEditorData] = useState('');

  async function savePost() {
    try {
      const {
        data: { data },
      } = await createPost({ content: editorData });

      console.log(data);
      setEditorData('');
    } catch (error) {
      console.log(error);
    }
  }

  //TODO: usecallback skips first data change
  const updatePostReaction = useCallback((post: Post) => {
    forceValidate((data) => {
      const idx = data.findIndex((el) => el.id === post.id);
      if (idx === -1) return data;
      let changed = [...data];
      changed[idx] = post;
      return changed;
    });
  }, []);

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
          <MemoizedPostCard key={post.id} post={post} updatePostReaction={updatePostReaction} />
        ))}
        <div className="flex justify-center w-full">
          <JButton label="Load more" onClick={validate} flat disabled={isEnd} />
        </div>
      </div>
    </>
  );
};

export default Test;
