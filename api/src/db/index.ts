import mongoose from 'mongoose';
import { parseEnv } from 'src/utils/helpers';

export async function createConnection() {
  try {
    console.log(parseEnv('MONGO_URI'));

    await mongoose.connect(parseEnv('MONGO_URI'), {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: true,
    });

    console.log('DB connected !');
  } catch (err) {
    console.log(err);
    Promise.reject(err);
  }
}
