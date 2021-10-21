import { createCommentOnPost } from 'src/services/comments';

const POST_ID = '616b095a67dffc379188f7a9';
const comment = {
  comment: 'Hello from test',
};

describe('Comment service', () => {
  test('create comment on post', async () => {
    await expect(createCommentOnPost(POST_ID, comment as any)).resolves.toMatch('comment created');
  });
});
