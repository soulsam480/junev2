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
  @prop({ ref: 'Post' })
  post_id: Ref<Post>;

  @prop({ ref: 'User' })
  public user: Ref<User>;

  @prop({ ref: 'User' })
  public likes?: Ref<User>[];

  @prop({ ref: 'Reply' })
  public replies?: Ref<Reply>[];

  @prop()
  public comment: string;

  public get total_likes() {
    return this.likes?.length;
  }

  @prop({ ref: () => Reply, foreignField: 'comment_id', localField: '_id', count: true })
  public total_replies?: number;

  // @prop({
  //   ref: () => User,
  //   foreignField: 'liked_comments',
  //   localField: '_id',
  //   count: true,
  //   match: (doc) => ({ _id: doc._id }),
  // })
  // public total_likes?: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
  },
})
export class Reply extends TimeStamps {
  @prop({ ref: 'Comment' })
  public comment_id: Ref<Comment>;

  @prop({ ref: 'Post' })
  public post_id: Ref<Post>;

  @prop({ ref: 'User' })
  public user: Ref<User>;

  @prop({ ref: 'User' })
  public likes?: Ref<User>[];

  @prop()
  public comment: string;

  public get total_likes() {
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

  @prop({ ref: 'Comment' })
  public comments?: Ref<Comment>[];

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

export const replyModel = getModelForClass(Reply);
