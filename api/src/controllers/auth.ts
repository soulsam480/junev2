import { createController, createRoute } from 'src/utils/routing';

const homepage = createRoute({
  method: 'GET',
  url: '',
  handler: (req, reply) => {
    reply.send('OK');
  },
  fAuthHandler: [
    (req, res, next) => {
      console.log('Yes');
      next();
    },
  ],
});

export const authController = createController([homepage], {
  prefix: 'v1',
  fAuthHandler: [
    (req, res, next) => {
      console.log('form global');
      next();
    },
  ],
  authOpts: {
    relation: 'and',
    run: 'all',
  },
});
