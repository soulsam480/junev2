import React, { useState } from 'react';

import { getAllPosts } from 'src/Shared/services/post';
import { useQuery } from 'src/utils/hooks';
import { Post, ResponseSchema } from 'src/utils/types';
import AppPostEditor from 'src/Shared/components/PostEditor';
import { createPost } from 'src/Shared/services/post';
import { useAlert } from 'src/Lib/store/alerts';
import PostFeed from 'src/Feed/components/PostFeed';

interface Props {}

const Test: React.FC<Props> = () => {
  const [editorData, setEditorData] = useState('');
  const setAlert = useAlert((state) => state.setAlert);

  const { validate: create, isLoading: createLoading } = useQuery<
    ResponseSchema<Post>,
    [{ content: string }]
  >({ data: {} as any }, (args) => createPost(...args));

  async function savePost() {
    if (createLoading) return;
    try {
      const { data } = await create({ content: editorData });

      console.log(data);

      setEditorData('');
      setAlert({ message: 'Post published', type: 'success' });
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: 'Some error occured !' });
    }
  }

  return (
    <>
      <div className="pb-3 flex flex-col space-y-2">
        <div className="flex justify-end flex-col items-end space-y-2">
          <AppPostEditor
            value={editorData}
            setValue={setEditorData}
            placeholder="use @ to mention"
            className="w-full h-full"
            onPost={savePost}
            isLoading={createLoading}
          />
        </div>
      </div>

      <PostFeed fetcher={getAllPosts} />
    </>
  );
};

export default Test;
