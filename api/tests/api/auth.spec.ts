import mongoose from 'mongoose';
// import { main } from 'src/index';
import { parseEnv } from 'src/utils/helpers';
import supertest from 'supertest';

const newUser = {
  email: 'sambit@gmail.com',
  password: 'sambit',
  username: 'sambitsahoojs',
  name: 'Sambit Sahoo',
};

describe('Post endpoint', () => {
  beforeEach((done) => {
    mongoose.connect(parseEnv('MONGO_URI'), {}, () => done());
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  test('POST /auth/register', async () => {
    const data = await supertest('http://localhost:3000')
      .post('/auth/register/')
      .send({ user: newUser })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toBeTruthy();

    expect(data.body.email).toBe(newUser.email);
    expect(data.body.name).toBe(newUser.name);
    expect(data.body.username).toBe(newUser.username);

    expect(data.body.token).toBeTruthy();
    expect(data.body.refresh).toBeTruthy();
  });
});
