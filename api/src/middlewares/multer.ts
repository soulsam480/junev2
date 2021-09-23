import multer, { memoryStorage } from 'multer';

// allow 5mb
const FILE_LIMIT = 5 * 1024 * 1024;

const storage = memoryStorage();

export const upload = multer({
  storage,
  limits: { files: 1, fileSize: FILE_LIMIT },
}).single('file');
