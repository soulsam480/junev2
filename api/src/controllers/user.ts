import { createController, createRoute } from 'dango-core';
import { User, userModel } from 'src/entities/user';
import { getUserPosts, getUserProfile, updatePassword, updateUser } from 'src/services/user';
import { filterFromQuery } from 'src/utils/helpers';
import { UpdateQuery } from 'mongoose';
import { UpdatePasswordDto } from 'src/utils/dtos';

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

const userDetailsUpdate = createRoute<UpdateQuery<User>, { userId: string }>({
  path: '/:userId',
  method: 'patch',
  handler: async ({ body, res, params: { userId } }) => {
    try {
      if (!body)
        return res.sendError(400, {
          message: 'No user data provided',
        });

      const data = await updateUser(userId, body);
      res.json(data);
    } catch (error) {
      res.sendError(500, { message: 'Internal server error', error });
    }
  },
});

const userPasswordUpdate = createRoute<UpdatePasswordDto, { userId: string }>({
  path: '/:userId/password',
  method: 'post',
  handler: async ({ body, res, params: { userId } }) => {
    try {
      if (!Object.values(body).every((val) => !!val))
        return res.sendError(400, {
          message: 'No user data provided',
        });

      const data = await updatePassword(userId, body);
      res.json(data);
    } catch (error) {
      res.sendError(500, { message: 'Internal server error', error });
    }
  },
});

const userController = createController('/users', [
  searchUser,
  userData,
  userPosts,
  userDetailsUpdate,
  userPasswordUpdate,
]);

export { userController };
