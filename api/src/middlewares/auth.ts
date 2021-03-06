import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { createError, parseEnv } from 'src/utils/helpers';

export function auth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers['authorization'];

  if (!token || typeof token !== 'string')
    return res.status(401).send(createError('Unauthorized !'));

  if (!token.startsWith('Bearer ')) return res.status(401).send(createError('Unauthorized !'));

  token = token.split('Bearer ')[1];

  try {
    const { userId } = <{ userId: string }>verify(token, parseEnv<string>('ACCESS_TOKEN_SECRET'));
    req.userId = userId;
    return next();
  } catch {
    res.status(401).send(createError('Unauthorized'));
  }
}
