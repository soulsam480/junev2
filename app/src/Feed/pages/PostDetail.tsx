import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import JSpinner from 'src/Lib/JSpinner';
import {
  createCommentOnPost,
  createReplyOnComment,
  getCommentReplies,
  getPost,
  getPostComments,
} from 'src/Shared/services/post';
import { useMountedRef } from 'src/utils/hooks';
import { Comment, Post } from 'src/utils/types';
import PostCard from 'src/Feed/components/PostCard';
import JContainer from 'src/Lib/JContainer';
import JInput from 'src/Lib/JInput';
import PostComments, { ReplyCtx } from 'src/Feed/components/postCard/comments/PostComment';
import { useAlert } from 'src/Lib/store/alerts';
import JButton from 'src/Lib/JButton';

interface Props {}

const PostDetail: React.FC<Props> = () => {
  const { postId } = useParams();
  const { search } = useLocation();
  const setAlert = useAlert((s) => s.setAlert);

  const [postData, setPostData] = useState<Post>({} as any);
  const [isLoading, setLoading] = useState(false);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [replyCtx, setReplyCtx] = useState<ReplyCtx | null>(null);

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

  async function getRepliesOnComment(id: string) {
    try {
      const {
        data: { data },
      } = await getCommentReplies(postId, id);

      setPostComments((p) => {
        return p.map((el) => (el.id !== id ? el : { ...el, replies: data }));
      });
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    }
  }

  async function createComment() {
    try {
      await createCommentOnPost(postId, { comment });

      setComment('');
      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    }
  }

  async function createReply(commentId: string) {
    try {
      await createReplyOnComment(postId, commentId, { comment });

      setComment('');
      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setReplyCtx(null);
    }
  }

  async function commentAction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!comment) return;

    if (replyCtx) {
      return await createReply(replyCtx.id);
    }

    await createComment();
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
                {!!replyCtx && (
                  <div className="text-xs text-warm-gray-500 flex space-x-2 justify-between items-center">
                    <div>replying to {replyCtx?.username} </div>
                    <JButton
                      icon="ion:close-circle-outline"
                      noBg
                      dense
                      title="cancel"
                      onClick={() => setReplyCtx(null)}
                    />
                  </div>
                )}
                <form className=" flex space-x-2 items-stretch" onSubmit={commentAction}>
                  <JInput
                    value={comment}
                    onInput={setComment}
                    placeholder="comment"
                    className="flex-grow"
                    dense
                  />
                  <div className="sm:hidden">
                    <JButton label="post" noBg sm type="submit" disabled={!comment} />
                  </div>
                </form>

                {postComments.map((comment) => {
                  return (
                    <PostComments
                      comment={comment}
                      key={comment.id}
                      setReplyCtx={setReplyCtx}
                      onRepliesExpand={getRepliesOnComment}
                    />
                  );
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
