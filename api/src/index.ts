require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });

import fastify from 'fastify';
import { createConnection } from 'src/db';
import { parseEnv } from 'src/utils/helpers';
import { setLogLevel } from '@typegoose/typegoose';
import { authController } from './controllers/auth';

const PORT = parseEnv<number>('PORT') || 3000;

setLogLevel('TRACE');

async function main() {
  const app = fastify({
    logger: true,
  });

  authController(app);

  await createConnection();

  app.listen(PORT, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Listening on http://localhost:${PORT}`);
  });
}

main();
