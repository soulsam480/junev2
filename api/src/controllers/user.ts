import { Router } from 'express';
import { userModel } from 'src/entities/user';
import { auth } from 'src/middlewares/auth';
import { createError, filterFromQuery } from 'src/utils/helpers';

const userRouter = Router();

userRouter.use(auth);

userRouter.get('/search', async (req, res) => {
  try {
    const data = await filterFromQuery(req.query, userModel, ['username', 'name']);
    res.send(data);
  } catch (error) {
    res.status(500).send(createError('Internal server error.', error));
  }
});

export { userRouter };
