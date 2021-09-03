import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import JSpinner from 'src/Lib/JSpinner';
import { createCommentOnPost, getPost, getPostComments } from 'src/Shared/services/post';
import { useMountedRef } from 'src/utils/hooks';
import { Comment, Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import JContainer from 'src/Lib/JContainer';
import JInput from 'src/Lib/JInput';
import PostComments from 'src/Feed/components/postCard/comments/PostComment';
import { useAlert } from 'src/Lib/store/alerts';

interface Props {}

const PostDetail: React.FC<Props> = () => {
  const { postId } = useParams();
  const { search } = useLocation();
  const setAlert = useAlert((s) => s.setAlert);

  const [postData, setPostData] = useState<Post>({} as any);
  const [isLoading, setLoading] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);

  const [isRenders, setIsRenders] = useState({
    isComments: false,
    isCommentsLoading: true,
  });

  const [comment, setComment] = useState('');

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

  async function getComments() {
    setIsRenders((p) => ({ ...p, isCommentsLoading: true }));
    try {
      const { data } = await getPostComments(postId);

      setPostComments([...data.data]);
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setIsRenders((p) => ({ ...p, isCommentsLoading: false }));
    }
  }

  async function createComment() {
    if (!comment) return;

    try {
      await createCommentOnPost(postId, { comment });

      setComment('');
      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
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

  useEffect(() => {
    if (isRenders.isComments) {
      getComments();
    }
  }, [isRenders.isComments]);

  return !isLoading && !!Object.keys(postData).length ? (
    <div className="post-detail">
      <PostCard
        post={postData}
        updatePostReaction={updatePostReaction}
        onCommentClick={handleCommentBtnClick}
      />

      {isRenders.isComments && (
        <JContainer className="mt-3 rounded-md flex flex-col space-y-2">
          {isRenders.isCommentsLoading ? (
            <div className="flex items-center justify-center">
              <JSpinner size="20px" />
            </div>
          ) : (
            <>
              <div className="flex-col space-y-2">
                <div className="flex space-x-2 items-stretch">
                  <JInput
                    value={comment}
                    onInput={setComment}
                    placeholder="comment"
                    className="flex-grow"
                    dense
                    onEnter={createComment}
                  />
                </div>

                {postComments.map((comment) => {
                  return <PostComments comment={comment} key={comment.id} />;
                })}
              </div>
            </>
          )}
        </JContainer>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center pt-5">
      <JSpinner size="50px" />
    </div>
  );
};

export default PostDetail;
