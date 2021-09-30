import { Router } from 'express';
import { sign, verify } from 'jsonwebtoken';
import passport from 'passport';
import { userModel } from 'src/entities/user';
import { auth } from 'src/middlewares/auth';
import { createTokens } from 'src/services/auth';
import { createError, parseEnv } from 'src/utils/helpers';
// import faker from 'faker';
// import { CreateQuery } from 'mongoose';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { user } = req.body as { user: any };
  if (!user) return res.status(404).send(createError('User not found!'));

  const userFound = await userModel.find({
    $or: [{ email: user.email }, { username: user.username }],
  });

  if (userFound.length > 0)
    return res.status(400).send(createError('An user exists with the same credentials!'));

  try {
    const newUser = await userModel.create({ ...user });

    res.json({
      ...newUser.toJSON(),
      ...createTokens(newUser.toJSON()),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error', error));
  }
});

authRouter.post('/login', async (req, res) => {
  const { user } = req.body as { user: Record<string, string> };
  const { key, password } = user;

  if (!user) return res.status(404).send(createError('User not found!'));

  try {
    const userFromDb = await userModel
      .findOne(key.includes('@') ? { email: key } : { username: key })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments');

    if (!userFromDb) return res.status(404).send(createError('Username or password is incorrect!'));

    if (!(await userFromDb.comparePassword(password)))
      return res.status(400).send(createError('Username or password is incorrect!'));

    res.json({
      ...userFromDb.toJSON(),
      ...createTokens(userFromDb.toJSON()),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error', error));
  }
});

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  const uid = (req?.user as any).id;

  const token = sign({ userId: uid }, parseEnv<string>('ACCESS_TOKEN_SECRET'), {
    expiresIn: '15min',
  });

  const redirectUrl = !process.env.PROD
    ? `http://localhost:4002/?auth_success=${token}`
    : `https://june.sambitsahoo.com/?auth_success=${token}`;

  res.redirect(redirectUrl);
});

/**
 * @swagger
 * /user:
 *    get:
 *      description: returns the data of the logged in user
 */
authRouter.get('/user', auth, async (req, res) => {
  const { userId } = req;

  try {
    const userFromDb = await userModel
      .findOne({ _id: userId })
      .select('-followers -followings -liked_posts -commented_posts -liked_comments -password');

    if (!userFromDb) return res.status(404).send(createError('User not found !'));

    res.json({
      ...userFromDb.toJSON(),
      ...createTokens(userFromDb.toJSON()),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error', error));
  }
});

authRouter.get('/token', async (req, res) => {
  let token = req.headers['token'];

  if (!token || typeof token !== 'string')
    return res.status(401).send(createError('Unauthorized !'));
  if (!token.startsWith('Bearer ')) return res.status(401).send(createError('Unauthorized !'));

  token = token.split('Bearer ')[1];

  try {
    const { userId } = <{ userId: string }>verify(token, parseEnv<string>('REFRESH_TOKEN_SECRET'));
    const userFromDb = await userModel.findOne({ _id: userId }).select('id');

    if (!userFromDb) return res.status(404).send(createError('User not found !'));

    res.json({
      ...createTokens(userFromDb.toJSON()),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(createError('Internal server error', error));
  }
});

/**
 * @private only for seeding once
 */
// authRouter.get('/seed', async (req, res) => {
//   let timeSeriesData: any[] = [];

//   for (let i = 0; i < 200; i++) {
//     const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
//     const newUser: CreateQuery<User> = {
//       name,
//       username: name.split(' ').join('_'),
//       email: faker.internet.email(),
//       password: faker.datatype.uuid(),
//       ga_id: faker.datatype.uuid(),
//     };

//     timeSeriesData.push(newUser);
//   }

//   await userModel.insertMany(timeSeriesData);

//   res.json('OK');
// });

export { authRouter };
