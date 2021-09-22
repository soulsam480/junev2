import { S3Client } from '@aws-sdk/client-s3';
import { parseEnv } from 'src/utils/helpers';

export const s3 = new S3Client({
  region: parseEnv<string>('REGION'),
  credentials: {
    accessKeyId: parseEnv('AWS_ACCESS_KEY_ID'),
    secretAccessKey: parseEnv('AWS_SECRET_ACCESS_KEY'),
  },
});
