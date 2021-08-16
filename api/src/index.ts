require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });

import { mongoose, setLogLevel } from '@typegoose/typegoose';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'src/db';
import { parseEnv } from 'src/utils/helpers';
import { authRouter } from 'src/controllers/auth';
import { setupOauth } from './oauth';
// import { serve, setup } from 'swagger-ui-express';
// import specs from '../swagger-spec.json';
import { userRouter } from './controllers/user';
import { createExpressServer } from 'dango-core';
import { postController } from './controllers/post';

const PORT = parseEnv<number>('PORT') || 3000;

if (!parseEnv<boolean>('PROD')) {
  setLogLevel('TRACE');
  mongoose.set('debug', true);
}

async function main() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:4002', 'https://june.sambitsahoo.com'],
    }),
  );

  setupOauth(app);

  app.use('/auth', authRouter);
  app.use('/users', userRouter);

  // app.use('/api-docs', serve, setup(specs));

  createExpressServer(app, {
    controllers: [postController],
  });

  try {
    await createConnection();

    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
