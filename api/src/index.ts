import dotenv from 'dotenv';
dotenv.config();
import nanoexpress from 'nanoexpress';

const PORT = parseInt(process.env.PORT as string) || 3000;

async function main() {
  const app = nanoexpress();

  app.get('/', (req, res) => {
    return res.send({ status: 'ok' });
  });

  await app.listen(PORT);
  console.log(`Listening on http://localhost:${PORT}`);
}

main();
