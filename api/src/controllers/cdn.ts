import { GetObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { upload } from 'src/middlewares/multer';
import { getObject, getObjects, putObject } from 'src/services/cdn';
import { normalize, parseEnv } from 'src/utils/helpers';
import { Router } from 'express';
import { auth } from 'src/middlewares/auth';

const BUCKET = parseEnv<string>('BUCKET_NAME');

export const cdnRouter = Router();

//TODO: dont use this, this won't be deployed to prod
cdnRouter.get('/', auth, async (_, res) => {
  return res.json(await getObjects());
});

//TODO: send file as FormData use new FormData to construct form
// with a key file: File
cdnRouter.post('/', upload, async (req, res) => {
  const {
    file,
    query: { scope = '' },
  } = req;

  if (!file) return res.status(400).send('No file found');

  try {
    const file_name = `${scope ? `${scope}/` : ''}${uuid()}--${normalize(file.originalname)}`;

    const objectParams: PutObjectCommandInput = {
      Bucket: BUCKET,
      Key: file_name,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        type: file.mimetype,
      },
    };

    await putObject(objectParams);

    return res.json({ key: file_name });
  } catch (error) {
    console.log(error);

    return res.status(500).send('Internal server error !');
  }
});

//TODO: send file_name in query
// e.g. http://localhost:3000/cdn/file?file_name=4df12050-a54f-46b7-99e0-42730d9d4127--June_logo.svg
cdnRouter.get('/file', async (req, res) => {
  const {
    query: { file_name },
  } = req;

  if (!file_name) return res.status(400).send('No filename found !');

  try {
    const objectParams: GetObjectCommandInput = {
      Bucket: BUCKET,
      Key: file_name as string,
    };

    const response = await getObject(objectParams);

    if (!response) return res.status(400).send("File doesn't exist !");

    const { file, type, length, ranges } = response;

    res.setHeader('Accept-Ranges', ranges);
    res.setHeader('Cache-Control', 'public, no-transform, immutable, max-age=2592000');
    res.setHeader('Content-Length', length);
    res.setHeader('Content-Type', type);
    res.setHeader('Date', new Date().toString());

    return res.send(file);
  } catch (error) {
    console.log(error);

    return res.status(500).send(error);
  }
});
