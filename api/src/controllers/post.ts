import { Router } from 'express';
import { auth } from 'src/middlewares/auth';
import { createPost, getAllPosts, getPostsByUserId } from 'src/services/post';
import { createError, formatResponse } from 'src/utils/helpers';

const postRouter = Router();

postRouter.use(auth);

postRouter.get('/', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.send(formatResponse(posts));
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

export { postRouter };
