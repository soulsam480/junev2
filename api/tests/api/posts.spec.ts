import mongoose from 'mongoose';
import { parseEnv } from 'src/utils/helpers';
// import supertest from 'supertest';

describe('Post endpoint', () => {
  beforeAll((done) => {
    mongoose.connect(parseEnv('MONGO_URI'), {}, () => done());
  });

  afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  //   test('GET /api/posts', async () => {
  //     const post = await Post.create({ title: 'Post 1', content: 'Lorem ipsum' });

  //     await supertest(app)
  //       .get('/api/posts')
  //       .expect(200)
  //       .then((response) => {
  //         // Check type and length
  //         expect(Array.isArray(response.body)).toBeTruthy();
  //         expect(response.body.length).toEqual(1);

  //         // Check data
  //         expect(response.body[0]._id).toBe(post.id);
  //         expect(response.body[0].title).toBe(post.title);
  //         expect(response.body[0].content).toBe(post.content);
  //       });
  //   });
});
