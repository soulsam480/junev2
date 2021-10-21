import { getObjects, getObject } from 'src/services/cdn';
import { parseEnv } from 'src/utils/helpers';

const BUCKET = parseEnv<string>('BUCKET_NAME');

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

  test('get file from CDN', async () => {
    const objectParams = {
      Bucket: BUCKET,
      Key: '6165af28e43002e7f028ffc3/679f7e8f-f291-4210-adc5-b184a93d143b--test.png',
    };

    const fileRes = await getObject(objectParams);

    expect(fileRes).toBeTruthy();

    if (!fileRes) {
      throw new Error('no file res');
    }

    expect(fileRes.file).toBeTruthy();
    expect(fileRes.type).toBeTruthy();
    expect(fileRes.length).toBeTruthy();
    expect(fileRes.ranges).toBeTruthy();
  });
});
