require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });

import { mongoose, setLogLevel } from '@typegoose/typegoose';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createExpressServer } from 'dango-core';

import { createConnection } from 'src/db';
import { parseEnv } from 'src/utils/helpers';
import { authRouter } from 'src/controllers/auth';
import { cdnRouter } from './controllers/cdn';
import { setupOauth } from './oauth';
// import { serve, setup } from 'swagger-ui-express';
// import specs from '../swagger-spec.json';
import { postController } from './controllers/post';
import { userController } from './controllers/user';
import { CORS_ORIGINS } from './utils/constants';

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
      origin: [...CORS_ORIGINS],
    }),
  );
  app.use(helmet());
  app.use(morgan('short'));
  app.enable('etag'); // use strong etags

  setupOauth(app);

  app.use('/auth', authRouter);
  app.use('/cdn', cdnRouter);

  // app.use('/api-docs', serve, setup(specs));

  createExpressServer(app, {
    controllers: [postController, userController],
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
