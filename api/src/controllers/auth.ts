import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { authenticate } from 'passport';
import { userModel } from 'src/entities/user';
import { auth } from 'src/middlewares/auth';
import { createTokens } from 'src/services/auth';
import { cerateError, parseEnv } from 'src/utils/helpers';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { user } = req.body as { user: any };
  if (!user) return res.status(404).send(cerateError('User not found!'));

  const userFound = await userModel.find({
    $or: [{ email: user.email }, { username: user.username }],
  });

  if (userFound.length > 0)
    return res.status(400).send(cerateError('An user exists with the same credentials!'));

  try {
    const newUser = await userModel.create({ ...user });

    (newUser.password as any) = undefined;
    res.send(newUser.toJSON());
  } catch (error) {
    console.log(error);
    res.status(500).send(cerateError('Internal server error', error));
  }
});

authRouter.post('/login', async (req, res) => {
  const { user } = req.body as { user: Record<string, string> };
  const { key, password } = user;

  if (!user) return res.status(404).send(cerateError('User not found!'));

  try {
    const userFromDb = await userModel
      .findOne(key.includes('@') ? { email: key } : { username: key })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments');

    if (!userFromDb) return res.status(404).send(cerateError('Username or password is incorrect!'));

    if (!(await userFromDb.comparePassword(password)))
      return res.status(400).send(cerateError('Username or password is incorrect!'));

    (userFromDb.password as any) = undefined;

    res.send({
      ...userFromDb.toJSON(),
      ...createTokens(userFromDb),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(cerateError('Internal server error', error));
  }
});

authRouter.get('/google', authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/redirect', authenticate('google'), (req, res) => {
  const uid = (req?.user as any).id;

  const token = sign({ userId: uid }, parseEnv<string>('ACCESS_TOKEN_SECRET'), {
    expiresIn: '15min',
  });

  const redirectUrl = !process.env.PROD
    ? `http://localhost:4002/?auth_success=${token}`
    : `https://june.sambitsahoo.com/?auth_success=${token}`;

  res.redirect(redirectUrl);
});

authRouter.get('/user', auth, async (req, res) => {
  const { userId } = req;

  try {
    const userFromDb = await userModel
      .findOne({ _id: userId })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments -password');

    if (!userFromDb) return res.status(404).send(cerateError('User not found !'));

    res.send({
      ...userFromDb.toJSON(),
      ...createTokens(userFromDb),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(cerateError('Internal server error', error));
  }
});

export { authRouter };
