require('tsconfig-paths/register');
import { join } from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: join(__dirname, '../.env') });

import fastify from 'fastify';
import fastifyAuth from 'fastify-auth';
import { setLogLevel } from '@typegoose/typegoose';
import { createConnection } from 'src/db';
import { parseEnv } from 'src/utils/helpers';
import { authController } from 'src/controllers/auth';

const PORT = parseEnv<number>('PORT') || 3000;

setLogLevel('TRACE');

async function main() {
  const app = fastify({
    logger: true,
  });

  app.register(fastifyAuth);

  await app.after();

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
