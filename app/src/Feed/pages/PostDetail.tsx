import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';
import JSpinner from 'src/Lib/JSpinner';
import { getPost } from 'src/Shared/services/post';
import { useMountedRef } from 'src/utils/hooks';
import { Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import { useAlert } from 'src/Lib/store/alerts';
import PostCommentsContainer from 'src/Feed/components/comments/PostCommentsContainer';
import PostEditDialog from 'src/Feed/components/PostEditDialog';
import JDialog from 'src/Lib/JDialog';
import { JunePaths } from 'src/Shared/router';

interface Props {}

const PostDetail: React.FC<Props> = () => {
  const { postId } = useParams();
  const { search, pathname } = useLocation();
  const nav = useNavigate();
  const isPost = useMatch(`/${JunePaths.Post}`);
  const setAlert = useAlert((s) => s.setAlert);

  const isEditModal = useMemo(() => {
    if (!isPost) return false;

    const isEdit = new URLSearchParams(search).get('action') === 'edit';
    return isEdit;
  }, [isPost, search]);

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
      } = await getPost(postId as string);

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
    const commentInput = document.getElementById('comment-input');

    if (!commentInput) return;

    commentInput.focus();
  }

  function handleDismiss() {
    nav(pathname, { replace: true });
  }

  async function completionHandler(success = false) {
    handleDismiss();

    if (success) {
      setLoading(true);
      setPostData({} as any);
      await getPostDetails();
    }
  }

  useEffect(() => {
    getPostDetails();
  }, [postId]);

  return !isLoading && !!Object.keys(postData).length ? (
    <div className="post-detail">
      <JDialog isModal={isEditModal} setModal={handleDismiss}>
        <PostEditDialog postContent={postData.content} completionHandler={completionHandler} />
      </JDialog>
      <PostCard
        post={postData}
        updatePostReaction={updatePostReaction}
        onCommentClick={handleCommentBtnClick}
      />
      <PostCommentsContainer postId={postId as string} />{' '}
    </div>
  ) : (
    <div className="flex items-center justify-center pt-5">
      <JSpinner size="50px" />
    </div>
  );
};

export default PostDetail;
