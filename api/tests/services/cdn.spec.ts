import { getObjects } from 'src/services/cdn';

describe('CDN service', () => {
  test('get all objects in S3', async () => {
    const data = await getObjects();

    expect(data).toContainEqual(
      expect.objectContaining({
        Key: expect.any(String),
        Size: expect.any(Number),
        StorageClass: expect.any(String),
        Owner: {
          ID: expect.any(String),
        },
      }),
    );
  });
});
