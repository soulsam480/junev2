import type { DocumentType } from '@typegoose/typegoose';
import type { User as UserModel } from 'src/entities/user';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user: DocumentType<UserModel>;
    }
  }
}
