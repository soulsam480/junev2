import { createRoute } from 'dango-core';
import { DocumentDefinition } from 'mongoose';

import {
  createCommentOnPost,
  createReplyOnPost,
  getCommentsForPost,
  getRepliesForComment,
  likeOnComment,
  likeOnReply,
  unLikeOnComment,
  unLikeOnReply,
} from 'src/services/comments';
import { formatResponse } from 'src/utils/helpers';
import { Comment } from 'src/entities/post';

export const getCommentsByPostId = createRoute<
  any,
  { id: string },
  { cursor: string; limit: string }
>({
  path: '/:id/comments',
  method: 'get',
  handler: async ({
    res,
    params: { id },
    query: { cursor: pagination_cursor, limit: pagination_limit },
  }) => {
    try {
      const cursor: number = parseInt(pagination_cursor);
      const limit: number = parseInt(pagination_limit) || 10;

      const comments = await getCommentsForPost(id, cursor, limit);

      res.json(comments);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const addCommentByPostId = createRoute<
  { comment: DocumentDefinition<Comment> },
  { id: string }
>({
  path: '/:id/comments',
  method: 'post',
  handler: async ({ req: { userId }, res, body: { comment }, params: { id } }) => {
    try {
      await createCommentOnPost(id, { ...comment, user: userId as string });
        
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const getRepliesByCommentId = createRoute<any, { id: string; commentId: string }>({
  path: '/:id/comments/:commentId',
  method: 'get',
  handler: async ({ res, params: { id, commentId } }) => {
    try {
      const replies = await getRepliesForComment(id, commentId);

      res.json(formatResponse(replies));
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const addReplyByCommentId = createRoute<
  { comment: DocumentDefinition<Comment> },
  { id: string; commentId: string }
>({
  path: '/:id/comments/:commentId',
  method: 'post',
  handler: async ({ req: { userId }, res, body: { comment }, params: { id, commentId } }) => {
    try {
      await createReplyOnPost(id, commentId, { ...comment, user: userId as string });

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const likeComment = createRoute<any, { id: string; commentId: string }>({
  path: '/:id/comments/:commentId/like',
  method: 'post',
  handler: async ({ req: { userId }, res, params: { id, commentId } }) => {
    try {
      await likeOnComment(id, commentId, userId as string);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const unLikeComment = createRoute<any, { id: string; commentId: string }>({
  path: '/:id/comments/:commentId/unlike',
  method: 'post',
  handler: async ({ req: { userId }, res, params: { id, commentId } }) => {
    try {
      await unLikeOnComment(id, commentId, userId as string);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const likeReply = createRoute<any, { id: string; commentId: string; replyId: string }>({
  path: '/:id/comments/:commentId/replies/:replyId/like',
  method: 'post',
  handler: async ({ req: { userId }, res, params: { commentId, id, replyId } }) => {
    try {
      await likeOnReply(id, commentId, replyId, userId as string);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

export const unLikeReply = createRoute<any, { id: string; commentId: string; replyId: string }>({
  path: '/:id/comments/:commentId/replies/:replyId/unlike',
  method: 'post',
  handler: async ({ req: { userId }, res, params: { commentId, id, replyId } }) => {
    try {
      await unLikeOnReply(id, commentId, replyId, userId as string);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});
