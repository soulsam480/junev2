import { createContext, useContext } from 'react';
import { ReplyCtx } from 'src/Feed/components/comments/PostComment';
import { Comment, Reply } from 'src/utils/types';

export interface CommentAPI {
  setReplyCtx: (ctx: ReplyCtx | null) => void;
  onRepliesExpand: (id: string) => any;
  commentAction: (comment: string) => Promise<any>;
  postId: string;
  updateCommentReaction(comment: Comment): void;
  updateReplyReaction(commentId: string, reply: Reply): void;
}

export const CommentApi = createContext<CommentAPI>({
  onRepliesExpand: null as any,
  setReplyCtx: null as any,
  commentAction: null as any,
  postId: null as any,
  updateCommentReaction: null as any,
  updateReplyReaction: null as any,
});

export function useComment() {
  return useContext(CommentApi);
}
