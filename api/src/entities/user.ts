import { getModelForClass, modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { compare, hash } from 'bcrypt';
import { parseEnv } from 'src/utils/helpers';
import { Comment, Post, Reply } from 'src/entities/post';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({
  schemaOptions: { timestamps: true, toJSON: { virtuals: true, versionKey: false } },
})
@pre<User>('save', async function (next) {
  if (!this.isModified('password')) next();

  try {
    this.password = await this.hashPassword(this.password);
    next();
  } catch (error) {
    next(error as any);
  }
})
export class User extends TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true, trim: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ default: '' })
  public bio?: string;

  @prop({ default: '' })
  public image?: string;

  @prop({ default: '' })
  public cover?: string;

  @prop({ ref: () => User })
  public followers?: Ref<User>[];

  public get total_followers() {
    return this.followers?.length;
  }

  @prop({ ref: () => User })
  public followings?: Ref<User>[];

  public get total_followings() {
    return this.followings?.length;
  }

  @prop({ required: true })
  public password!: string;

  @prop()
  public ga_id!: string;

  @prop({ ref: () => Post })
  public liked_posts?: Ref<Post>[];

  @prop({ ref: () => Post })
  public commented_posts?: Ref<Post>[];

  @prop({ ref: () => Comment })
  public liked_comments?: Ref<Comment>[];

  @prop({ ref: () => Reply })
  public replied_posts?: Ref<Post>[];

  @prop({ ref: () => Reply })
  public liked_replies?: Ref<Reply>[];

  public async hashPassword(pass: string) {
    if (!pass) return '';
    try {
      return await hash(pass, parseInt(parseEnv('HASH_SALT')));
    } catch (error) {
      return '';
    }
  }

  public async comparePassword(pass: string) {
    return await compare(pass, this.password);
  }
}

export const userModel = getModelForClass(User);
