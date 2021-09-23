import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import JCard from 'src/Lib/JCard';
import { useAlert } from 'src/Lib/store/alerts';
import AppPostEditor from 'src/Shared/components/PostEditor';
import { updatePost } from 'src/Shared/services/post';

interface Props {
  postContent: string;
  completionHandler: (val?: boolean) => void;
}

const PostEditDialog: React.FC<Props> = ({ postContent, completionHandler }) => {
  const { postId } = useParams();
  const setAlert = useAlert((s) => s.setAlert);

  const [isLoading, setLoading] = useState(false);
  const [postData, setPostData] = useState(postContent);

  async function handleOnPost() {
    if (!postData) return;

    setLoading(true);
    try {
      await updatePost(postId as string, { content: postData });
      completionHandler(true);

      setAlert({ message: 'Post updated!', type: 'success' });
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: 'Some error occured !' });
    } finally {
      completionHandler(false);
    }
  }

  return (
    <JCard style={{ width: '500px' }}>
      <AppPostEditor
        value={postData}
        setValue={(val) => setPostData(val)}
        isLoading={isLoading}
        onPost={handleOnPost}
      />
    </JCard>
  );
};

export default PostEditDialog;
