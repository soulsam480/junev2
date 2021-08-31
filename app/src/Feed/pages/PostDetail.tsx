import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import JSpinner from 'src/Lib/JSpinner';
import { getPost } from 'src/Shared/services/post';
import { useMountedRef } from 'src/utils/hooks';
import { Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import JContainer from 'src/Lib/JContainer';

interface Props {}

const PostDetail: React.FC<Props> = () => {
  const { postId } = useParams();
  const [postData, setPostData] = useState<Post>({} as any);
  const [isLoading, setLoading] = useState(false);

  const { mountedRef } = useMountedRef();

  const updatePostReaction = useCallback((post: Post) => {
    setPostData((prev) => ({ ...prev, likes: post.likes }));
  }, []);

  async function getPostDetails() {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await getPost(postId);

      if (!mountedRef.current) return;

      setPostData({ ...data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPostDetails();
  }, [postId]);

  return !isLoading && !!Object.keys(postData).length ? (
    <div className="post-detail">
      <PostCard post={postData} updatePostReaction={updatePostReaction} />
      <JContainer className="mt-3 rounded-md">Comments container</JContainer>
    </div>
  ) : (
    <div className="flex items-center justify-center pt-5">
      <JSpinner size="50px" />
    </div>
  );
};

export default PostDetail;