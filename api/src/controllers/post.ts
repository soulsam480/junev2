import { createController, createRoute } from 'dango-core';
import { auth } from 'src/middlewares/auth';
import { createPost, getAllPosts, getPostsByUserId, likePost, unlikePost } from 'src/services/post';
import { createError, formatResponse } from 'src/utils/helpers';

/**
 * @private only for seeding once
 */
// postRouter.get('/seed', auth, async (req, res) => {
//   const { userId } = req;
//   let timeSeriesData: any[] = [];

//   for (let i = 0; i < 200; i++) {
//     const newPost: CreateQuery<Post> = {
//       content: faker.lorem.paragraph(),
//       user: userId as string,
//       url: faker.image.cats(),
//     };

//     timeSeriesData.push(newPost);
//   }

//   await postModel.insertMany(timeSeriesData);

//   return res.json('OK');
// });

const getPosts = createRoute<any, any, { cursor: string; limit: string }>({
  path: '/',
  method: 'get',
  handler: async (___, res, _, __, { limit: pagination_limit, cursor: pagination_cursor }) => {
    try {
      const cursor: number = parseInt(pagination_cursor);
      const limit: number = parseInt(pagination_limit) || 10;

      const data = await getAllPosts(cursor, limit);

      return res.json(data);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

const postsByUserId = createRoute<any, { id: string }>({
  path: '/user/:id',
  method: 'get',
  handler: async (__, res, _, { id }) => {
    if (!id) return res.status(400).send(createError('User id not found'));

    try {
      const posts = await getPostsByUserId(id);

      return res.json(formatResponse(posts));
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

const create = createRoute<{ post: { [x: string]: any } }>({
  path: '/',
  method: 'post',
  handler: async ({ userId }, res, { post }) => {
    if (!Object.keys(post).length) res.status(400).send(createError('Post not found'));

    try {
      const newPost = await createPost({ ...(post as any), user: userId });

      return res.json(formatResponse(newPost));
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

const like = createRoute<any, { id: string }>({
  path: '/:id/like',
  method: 'post',
  handler: async ({ userId }, res, _, { id }) => {
    try {
      await likePost(id, userId as string);

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

const unlike = createRoute<any, { id: string }>({
  path: '/:id/unlike',
  method: 'post',
  handler: async ({ userId }, res, _, { id }) => {
    try {
      await unlikePost(id, userId as string);

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendError(500, error);
    }
  },
});

const postController = createController('/posts', [getPosts, postsByUserId, create, like, unlike]);

export { postController };
