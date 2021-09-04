import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import JSpinner from 'src/Lib/JSpinner';
import { getPost } from 'src/Shared/services/post';
import { useMountedRef } from 'src/utils/hooks';
import { Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import { useAlert } from 'src/Lib/store/alerts';
import PostCommentsContainer from 'src/Feed/components/comments/PostCommentsContainer';

interface Props {}

const PostDetail: React.FC<Props> = () => {
  const { postId } = useParams();
  const { search } = useLocation();
  const setAlert = useAlert((s) => s.setAlert);

  const [postData, setPostData] = useState<Post>({} as any);
  const [isLoading, setLoading] = useState(false);

  const [isRenders, setIsRenders] = useState({
    isComments: false,
  });

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

      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setLoading(false);
    }
  }

  function handleCommentBtnClick() {
    if (isRenders.isComments) return;

    setIsRenders((p) => ({ ...p, isComments: true }));
  }

  useEffect(() => {
    getPostDetails();
  }, [postId]);

  useEffect(() => {
    if (!search) return;

    const isComments = new URLSearchParams(search).get('comments');
    if (!isComments) return;

    setIsRenders((p) => ({ ...p, isComments: true }));
  }, [search]);

  return !isLoading && !!Object.keys(postData).length ? (
    <div className="post-detail">
      <PostCard
        post={postData}
        updatePostReaction={updatePostReaction}
        onCommentClick={handleCommentBtnClick}
      />

      {isRenders.isComments && <PostCommentsContainer postId={postId} />}
    </div>
  ) : (
    <div className="flex items-center justify-center pt-5">
      <JSpinner size="50px" />
    </div>
  );
};

export default PostDetail;
