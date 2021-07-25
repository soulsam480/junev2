import mongoose from 'mongoose';
import { parseEnv } from 'src/utils/helpers';

export async function createConnection() {
  try {
    await mongoose.connect(parseEnv('MONGO_URI'), {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    });

    console.log('DB connected !');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
