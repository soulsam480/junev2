import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from 'src/entities/user';

@modelOptions({
  schemaOptions: { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
})
export class Comment extends TimeStamps {
  @prop()
  public comment: string;

  @prop({ ref: () => User })
  public user: Ref<User>;

  @prop({ ref: () => User })
  public likes?: Ref<User>[];

  @prop({ ref: () => Comment })
  public replies: Ref<Comment>[];

  public get total_likes() {
    return this.likes?.length;
  }

  public get total_replies() {
    return this.likes?.length;
  }
}

@modelOptions({
  schemaOptions: { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
})
export class Post extends TimeStamps {
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

  public get total_likes() {
    return this.likes?.length;
  }

  public get total_comments() {
    return this.comments?.length;
  }
}

export const postModel = getModelForClass(Post);
