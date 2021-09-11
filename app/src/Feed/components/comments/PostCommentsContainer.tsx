import React, { useCallback, useEffect, useState } from 'react';
import { CommentApi } from 'src/Feed/context/commentApi';
import JButton from 'src/Lib/JButton';
import JContainer from 'src/Lib/JContainer';
import PostComment, { ReplyCtx } from 'src/Feed/components/comments/PostComment';
import PostCommentForm from 'src/Feed/components/comments/PostCommentForm';
import { Comment, PaginationParams, Reply } from 'src/utils/types';
import { useAlert } from 'src/Lib/store/alerts';
import {
  createCommentOnPost,
  createReplyOnComment,
  getCommentReplies,
  getPostComments,
} from 'src/Shared/services/post';
import { useObserver, usePaginatedQuery } from 'src/utils/hooks';

const MemoizedPostComment = React.memo(PostComment);

interface Props {
  postId: string;
}

const PostCommentsContainer: React.FC<Props> = ({ postId }) => {
  const setAlert = useAlert((s) => s.setAlert);
  const [observerRef] = useObserver<HTMLDivElement>(observerCb);
  const [isCommentAction, setCommentAction] = useState(false);

  const {
    data: postComments,
    isLoading: isCommentsLoading,
    forceValidate: setPostComments,
    validate: getComments,
    reset,
    isEnd,
    error,
  } = usePaginatedQuery([], fetcher(postId), { limit: 15 });

  async function observerCb() {
    if (isEnd) return;
    if (isCommentsLoading) return;
    await getComments();
  }

  const [replyCtx, setReplyCtx] = useState<ReplyCtx | null>(null);

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

  function fetcher(id: string) {
    return (opts: PaginationParams) => getPostComments(id, { ...opts });
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
    if (isCommentAction || isCommentsLoading) return;
    setCommentAction(true);

    try {
      await createCommentOnPost(postId, { comment });

      reset();
      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setCommentAction(false);
    }
  }

  async function createReply(commentId: string, comment: string) {
    if (isCommentAction || isCommentsLoading) return;
    setCommentAction(true);

    try {
      await createReplyOnComment(postId, commentId, { comment });

      reset();
      getComments();
    } catch (error) {
      console.log(error);
      setAlert({ type: 'danger', message: (error as any).message });
    } finally {
      setReplyCtx(null);
      setCommentAction(false);
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

  useEffect(() => {
    if (!!error) {
      setAlert({ type: 'danger', message: error.message });
    }
  }, [error]);

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

        <PostCommentForm isLoading={isCommentAction} />
      </JContainer>

      {!!postComments.length ? (
        <JContainer className="mt-3 rounded-md flex flex-col space-y-2 py-3">
          {postComments.map((comment) => {
            return <MemoizedPostComment comment={comment} key={comment.id} />;
          })}
        </JContainer>
      ) : (
        !isCommentsLoading && (
          <div className="flex justify-center w-full my-2">no comments yet !</div>
        )
      )}

      {(!!postComments.length || isCommentsLoading) && (
        <>
          <div className="flex flex-col w-full space-y-3 my-3">
            <div ref={observerRef} className="flex justify-center">
              <JButton
                label={isEnd ? 'no more' : ''}
                flat
                disabled={isEnd}
                loading={isCommentsLoading}
              />
            </div>
          </div>
        </>
      )}
    </CommentApi.Provider>
  );
};

export default PostCommentsContainer;
