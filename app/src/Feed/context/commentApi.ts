import { createContext, useContext } from 'react';
import { ReplyCtx } from 'src/Feed/components/comments/PostComment';
import { Comment } from 'src/utils/types';

export interface CommentAPI {
  setReplyCtx: (ctx: ReplyCtx | null) => void;
  onRepliesExpand: (id: string) => any;
  commentAction: (comment: string) => Promise<any>;
}

export const CommentApi = createContext<CommentAPI>({
  onRepliesExpand: null as any,
  setReplyCtx: null as any,
  commentAction: null as any,
});

export function useComment() {
  return useContext(CommentApi);
}
