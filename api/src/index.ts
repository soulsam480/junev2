require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });

import { setLogLevel } from '@typegoose/typegoose';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'src/db';
import { parseEnv } from 'src/utils/helpers';
import { authRouter } from 'src/controllers/auth';
import { setupOauth } from './oauth';

const PORT = parseEnv<number>('PORT') || 3000;

setLogLevel('TRACE');

async function main() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: ['*'],
    }),
  );

  setupOauth(app);

  app.use('/auth', authRouter);

  try {
    await createConnection();

    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
