import { createConnection } from '../src/db/index';

describe('connects to DB', () => {
  test('run connetor', async () => {
    expect(await createConnection()).toBe('DB connected !');
  });
});
