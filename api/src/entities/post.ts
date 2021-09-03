import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from 'src/entities/user';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
  },
})
export class Comment extends TimeStamps {
  @prop()
  public comment: string;

  @prop({ ref: 'User' })
  public user: Ref<User>;

  @prop({ ref: 'User' })
  public likes?: Ref<User>[];

  @prop({ type: () => Reply, default: [] })
  public replies?: Reply[];

  public get total_likes() {
    return this.likes?.length;
  }

  public get total_replies() {
    return this.likes?.length;
  }
}

class Reply extends TimeStamps {
  @prop()
  public comment: string;

  @prop({ ref: 'User' })
  public user: Ref<User>;

  @prop({ ref: 'User' })
  public likes?: Ref<User>[];

  public get total_likes() {
    return this.likes?.length;
  }

  public get total_replies() {
    return this.likes?.length;
  }
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
  },
})
export class Post extends TimeStamps {
  @prop({ ref: 'User' })
  public user: Ref<User>;

  @prop({ default: '' })
  public content: string;

  @prop({ default: '' })
  public url?: string;

  @prop({ ref: 'User' })
  public likes?: Ref<User>[];

  @prop({ type: () => Comment })
  public comments?: Comment[];

  @prop({ default: false })
  is_archived?: boolean;

  public get total_likes() {
    return this.likes?.length;
  }

  public get total_comments() {
    return this.comments?.length;
  }
}

export const postModel = getModelForClass(Post);

export const commentModel = getModelForClass(Comment);
