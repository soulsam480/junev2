import { createController, createRoute } from 'src/utils/routing';

const homepage = createRoute({
  method: 'GET',
  url: '',
  handler: (req, reply) => {
    reply.send('OK');
  },
});

export const authController = createController([homepage], {
  prefix: 'v1',
});
