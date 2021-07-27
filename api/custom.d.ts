import { DocumentType } from '@typegoose/typegoose';
import { User as UserModel } from 'src/entities/user';

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      user: DocumentType<UserModel>;
    }
  }
}
