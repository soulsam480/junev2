import {
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { s3 } from 'src/db/s3';
import { parseEnv, streamToString } from 'src/utils/helpers';

const BUCKET = parseEnv<string>('BUCKET_NAME');

export async function getObjects() {
  try {
    const data = await s3.send(new ListObjectsCommand({ Bucket: BUCKET }));

    return data.Contents;
  } catch (error) {
    Promise.reject(error);
  }
}

export async function putObject(data: PutObjectCommandInput) {
  try {
    const response = await s3.send(new PutObjectCommand(data));

    return response;
  } catch (error) {
    Promise.reject(error);
  }
}

export async function getObject(data: GetObjectCommandInput) {
  try {
    const response = await s3.send(new GetObjectCommand(data));

    const { ContentLength = 0, ContentType = '', AcceptRanges = '' } = response;

    const file = await streamToString(response.Body);

    return {
      file,
      type: ContentType,
      length: ContentLength,
      ranges: AcceptRanges,
    };
  } catch (error) {
    Promise.reject(error);
  }
}
