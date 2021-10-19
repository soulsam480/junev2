import React, { useState } from 'react';

import { getAllPosts } from 'src/Shared/services/post';
import { Post } from 'src/utils/types';
import AppPostEditor from 'src/Shared/components/PostEditor';
import { createPost } from 'src/Shared/services/post';
import { useAlert } from 'src/Lib/store/alerts';
import PostFeed from 'src/Feed/components/PostFeed';
import { useUserStore } from 'src/User/store/useUserStore';
import { compressImage } from 'src/utils/helpers';
import { uploadImage } from 'src/Shared/services/cdn';

interface Props {}

const Test: React.FC<Props> = () => {
  const { id } = useUserStore((s) => s.user);
  const [editorData, setEditorData] = useState('');
  const setAlert = useAlert((state) => state.setAlert);
  const [createLoading, setLoading] = useState(false);

  async function uploadPostImage(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const {
        data: {
          data: { key },
        },
      } = await uploadImage(formData, id);

      return key;
    } catch (error) {
      throw error;
    }
  }

  async function savePost(files: File[] | null) {
    if (createLoading) return;
    setLoading(true);

    try {
      let imageUrls: (string | undefined)[] = [];

      if (!!files && !!files.length) {
        imageUrls = await Promise.all(
          files.map(async (image) => await uploadPostImage(await compressImage(image))),
        );
      }

      await createPost({ content: editorData, images: imageUrls as string[] } as Post);

      setEditorData('');
      setAlert({ message: 'Post published', type: 'success' });
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: 'Some error occured !' });
    } finally {
      setLoading(false);
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
