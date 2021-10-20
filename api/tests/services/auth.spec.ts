import { createTokens } from 'src/services/auth';

describe('Auth service', () => {
  test('generates tokens', () => {
    expect(createTokens({ id: 'test' } as any)).toMatchObject(
      expect.objectContaining({
        token: expect.any(String),
        refresh: expect.any(String),
      }),
    );
  });
});
