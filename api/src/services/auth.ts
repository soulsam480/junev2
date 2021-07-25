import { DocumentType } from '@typegoose/typegoose';
import { sign } from 'jsonwebtoken';
import { User } from 'src/entities/user';
import { parseEnv } from 'src/utils/helpers';

export function createTokens(user: DocumentType<User>): {
  refreshToken: string;
  accessToken: string;
} {
  const refreshToken = sign({ userId: user.id }, parseEnv<string>('REFRESH_TOKEN_SECRET'), {
    expiresIn: '14d',
  });
  const accessToken = sign({ userId: user.id }, parseEnv<string>('ACCESS_TOKEN_SECRET'), {
    expiresIn: '15min',
  });

  return { refreshToken, accessToken };
}
