import { createController, createRoute } from 'dango-core';
import { auth } from 'src/middlewares/auth';
import { createPost, getAllPosts, getPostsByUserId, reactPost } from 'src/services/post';
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

//   res.send('OK');
// });

const postController = createController(
  '/posts',
  [
    createRoute<any, any, { cursor: string; limit: string }>({
      path: '/',
      method: 'get',
      handler: async (req, res, _, __, { limit: pagination_limit, cursor: pagination_cursor }) => {
        try {
          const cursor: number = parseInt(pagination_cursor);
          const limit: number = parseInt(pagination_limit) || 10;
          const data = await getAllPosts(cursor, limit);
          res.json({
            ...data,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send(createError('Internal server error.', error));
        }
      },
    }),
    createRoute<any, { id: string }>({
      path: '/user/:id',
      method: 'get',
      handler: async (req, res, _, { id }) => {
        if (!id) return res.status(400).send(createError('User id not found'));
        try {
          const posts = await getPostsByUserId(id);
          res.send(formatResponse(posts));
        } catch (error) {
          console.log(error);
          res.status(500).send(createError('Internal server error.', error));
        }
      },
    }),
    createRoute<{ post: { [x: string]: any } }>({
      path: '/',
      method: 'post',
      handler: async ({ userId }, res, { post }) => {
        if (!Object.keys(post).length) res.status(400).send(createError('Post not found'));
        try {
          const newPost = await createPost({ ...(post as any), user: userId });
          res.send(formatResponse(newPost));
        } catch (error) {
          console.log(error);
          res.status(500).send(createError('Internal server error.', error));
        }
      },
    }),
    createRoute<any, { id: string }>({
      path: '/:id/react',
      method: 'post',
      handler: async ({ userId }, res, _, { id }) => {
        try {
          const data = await reactPost(id, userId as string);
          res.send(formatResponse(data));
        } catch (error) {
          console.log(error);
          res.status(500).send(createError('Internal server error.', error));
        }
      },
    }),
  ],
  [auth],
);

export { postController };
