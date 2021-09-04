import React, { useCallback, useEffect, useState } from 'react';
import { CommentApi } from 'src/Feed/context/commentApi';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
import JSpinner from 'src/Lib/JSpinner';
import PostComment, { ReplyCtx } from 'src/Feed/components/comments/PostComment';
import PostCommentForm from 'src/Feed/components/comments/PostCommentForm';
import { Comment, Reply } from 'src/utils/types';
import { useAlert } from 'src/Lib/store/alerts';
import {
  createCommentOnPost,
  createReplyOnComment,
  getCommentReplies,
  getPostComments,
} from 'src/Shared/services/post';
import { useMountedRef } from 'src/utils/hooks';

const MemoizedPostComment = React.memo(PostComment);

interface Props {
  postId: string;
}

const PostCommentsContainer: React.FC<Props> = ({ postId }) => {
  const setAlert = useAlert((s) => s.setAlert);

  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [replyCtx, setReplyCtx] = useState<ReplyCtx | null>(null);
  const [isCommentsLoading, setCommentLoading] = useState(false);

  const updateCommentReaction = useCallback((comment: Comment) => {
    setPostComments((p) =>
      p.map((el) => (el.id !== comment.id ? el : { ...el, likes: comment.likes })),
    );
  }, []);

  const updateReplyReaction = useCallback((commentId: string, reply: Reply) => {
    setPostComments((p) =>
      p.map((co) =>
        co.id !== commentId
          ? co
          : {
              ...co,
              replies: co.replies?.map((re) =>
                re.id !== reply.id ? re : { ...re, likes: reply.likes },
              ),
            },
      ),
    );
  }, []);

  const { mountedRef } = useMountedRef();

  async function getComments() {
    setCommentLoading(true);

    try {
      const { data } = await getPostComments(postId);

      if (!mountedRef.current) return;
      setPostComments([...data.data]);
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setCommentLoading(false);
    }
  }

  async function getRepliesOnComment(id: string) {
    try {
      const {
        data: { data },
      } = await getCommentReplies(postId, id);

      setPostComments((p) => p.map((el) => (el.id !== id ? el : { ...el, replies: data })));
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    }
  }

  async function createComment(comment: string) {
    try {
      await createCommentOnPost(postId, { comment });

      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    }
  }

  async function createReply(commentId: string, comment: string) {
    try {
      await createReplyOnComment(postId, commentId, { comment });

      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setReplyCtx(null);
    }
  }

  async function commentAction(comment: string) {
    if (!comment) return;

    if (replyCtx) {
      return await createReply(replyCtx.id, comment);
    }

    await createComment(comment);
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <CommentApi.Provider
      value={{
        onRepliesExpand: useCallback(getRepliesOnComment, []),
        setReplyCtx: useCallback(setReplyCtx, []),
        commentAction: useCallback(commentAction, [replyCtx]),
        postId,
        updateCommentReaction,
        updateReplyReaction,
      }}
    >
      <JContainer className="mt-3 rounded-md flex flex-col space-y-2">
        {isCommentsLoading ? (
          <div className="flex items-center justify-center">
            <JSpinner size="20px" />
          </div>
        ) : (
          <>
            <div className="flex-col space-y-2">
              {!!replyCtx && (
                <div className="text-xs text-warm-gray-500 flex space-x-2 justify-between items-center">
                  <div>
                    replying to <b>{replyCtx?.username}</b>{' '}
                  </div>
                  <JButton
                    icon="ion:close-circle"
                    noBg
                    dense
                    title="cancel"
                    onClick={() => setReplyCtx(null)}
                  />
                </div>
              )}

              <PostCommentForm />

              {!!postComments.length &&
                postComments.map((comment) => {
                  return <MemoizedPostComment comment={comment} key={comment.id} />;
                })}
            </div>
          </>
        )}
      </JContainer>
    </CommentApi.Provider>
  );
};

export default PostCommentsContainer;
