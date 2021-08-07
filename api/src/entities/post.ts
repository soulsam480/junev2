import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from 'src/entities/user';

@modelOptions({ schemaOptions: { timestamps: true, toJSON: { virtuals: true } } })
export class Comment {
  @prop()
  public comment: string;

  @prop({ ref: () => User })
  public user: Ref<User>;

  @prop({ ref: () => User })
  public likes?: Ref<User>[];

  @prop({ ref: () => Comment })
  public replies: Ref<Comment>[];
}

@modelOptions({ schemaOptions: { timestamps: true, toJSON: { virtuals: true } } })
export class Post {
  @prop({ ref: () => User })
  public user: Ref<User>;

  @prop({ default: '' })
  public content: string;

  @prop({ default: '' })
  public url?: string;

  @prop({ ref: () => User })
  public likes?: Ref<User>[];

  @prop({ type: () => Comment })
  public comments?: Comment[];
}

export const postModel = getModelForClass(Post);
