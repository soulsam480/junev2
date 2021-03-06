import mongoose from 'mongoose';
import { parseEnv } from 'src/utils/helpers';

export async function createConnection() {
  try {
    await mongoose.connect(parseEnv('MONGO_URI'));

    console.log('DB connected !');
  } catch (err) {
    console.log(err);
    Promise.reject(err);
  }
}
