import mongoose from 'mongoose';
import { parseEnv } from '../utils/helpers';

export async function createConnection() {
  try {
    await mongoose.connect(parseEnv('MONGO_URI'));

    console.log('DB connected !');
    return 'DB connected !';
  } catch (err) {
    console.log(err);
    Promise.reject(err);
  }
}
