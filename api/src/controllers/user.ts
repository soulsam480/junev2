import { createController, createRoute } from 'dango-core';
import { userModel } from 'src/entities/user';
import { getUserPosts, getUserProfile } from 'src/services/user';
import { filterFromQuery } from 'src/utils/helpers';

const searchUser = createRoute({
  path: '/search',
  method: 'get',
  handler: async ({ req, res }) => {
    try {
      const data = await filterFromQuery(req.query, userModel, ['username', 'name'], {
        select: 'name username id',
      });

      res.json(data);
    } catch (error) {
      res.sendError(500, { message: 'Internal server error', error });
    }
  },
});

const userData = createRoute<any, { username: string }>({
  path: '/:username',
  method: 'get',
  handler: async ({ res, params: { username } }) => {
    try {
      const data = await getUserProfile(username);

      res.json(data);
    } catch (error) {
      res.sendError(500, { message: 'Internal server error', error });
    }
  },
});

const userPosts = createRoute<any, { id: string }, { cursor: string; limit: string }>({
  path: '/:id/posts',
  method: 'get',
  handler: async ({
    res,
    params: { id },
    query: { cursor: pagination_cursor, limit: pagination_limit },
  }) => {
    try {
      const cursor: number = parseInt(pagination_cursor);
      const limit: number = parseInt(pagination_limit) || 10;

      const data = await getUserPosts(id, cursor, limit);

      res.json(data);
    } catch (error) {
      res.sendError(500, { message: 'Internal server error', error });
    }
  },
});

const userController = createController('/users', [searchUser, userData, userPosts]);

export { userController };
