import { userModel } from 'src/entities/user';
import { createTokens } from 'src/services/auth';
import { createController, createRoute } from 'src/utils/routing';

const register = createRoute({
  method: 'POST',
  url: '/register',
  handler: async (req, reply) => {
    const { user } = req.body as { user: any };
    if (!user) return reply.code(404).send({ message: 'User not found!' });

    const userFound = await userModel.find({
      $or: [{ email: user.email }, { username: user.username }],
    });

    if (userFound.length > 0)
      return reply.code(400).send({ message: 'An user exists with the same credentials!' });

    try {
      const newUser = await userModel.create({ ...user });

      (newUser.password as any) = undefined;
      reply.send(newUser.toJSON());
    } catch (error) {
      console.log(error);
      reply.code(500).send(error);
    }
  },
});

const login = createRoute({
  method: 'POST',
  url: '/login',
  handler: async (req, reply) => {
    const { user } = req.body as { user: Record<string, string> };

    const { key, password } = user;

    if (!user) return reply.code(404).send({ message: 'User not found' });

    try {
      const userFromDb = await userModel
        .findOne(key.includes('@') ? { email: key } : { username: key })
        .select('-followers -followings -liked_posts -commented_posts -liked_comments');

      if (!userFromDb)
        return reply.code(404).send({ message: 'Username or password is incorrect!' });

      if (!(await userFromDb.comparePassword(password)))
        return reply.code(400).send({ message: 'Username or password is incorrect!' });

      (userFromDb.password as any) = undefined;

      reply.send({
        ...userFromDb.toJSON(),
        ...createTokens(userFromDb),
      });
    } catch (error) {
      console.log(error);
      reply.code(500).send(error);
    }
  },
});

export const authController = createController([register, login], {
  prefix: 'auth',
});
