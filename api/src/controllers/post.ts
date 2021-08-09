import { Router } from 'express';
import { auth } from 'src/middlewares/auth';
import { createPost, getAllPosts, getPostsByUserId } from 'src/services/post';
import { createError, formatResponse } from 'src/utils/helpers';

const postRouter = Router();

postRouter.use(auth);

postRouter.get('/', async (req, res) => {
  try {
    const limit: number = parseInt(req.query.limit as string) || 10;
    const page: number = parseInt(req.query.page as string) || 0;

    const data = await getAllPosts(page, limit);

    res.json({
      ...data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error.', error));
  }
});

postRouter.get('/user/:id', async (req, res) => {
  const {
    params: { id },
  } = req;

  if (!id) return res.status(400).send(createError('User id not found'));

  try {
    const posts = await getPostsByUserId(id);
    res.send(formatResponse(posts));
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error.', error));
  }
});

postRouter.post('/', async (req, res) => {
  const { userId, body } = req;

  if (!Object.keys(body.post).length) res.status(400).send(createError('Post not found'));

  try {
    const post = await createPost({ ...(body.post as any), user: userId });
    res.send(formatResponse(post));
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error.', error));
  }
});

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
export { postRouter };
