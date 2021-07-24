import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { compare, hash } from 'bcrypt';
import { parseEnv } from 'src/utils/helpers';

@modelOptions({ schemaOptions: { timestamps: true } })
class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true, trim: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ default: '' })
  public bio?: string;

  @prop({ default: '' })
  public profile_pic?: string;

  @prop({ ref: () => User })
  public followers?: Ref<User>[];

  @prop({ ref: () => User })
  public followings?: Ref<User>[];

  @prop({ required: true })
  public hashed_pass!: string;

  public set password(val: string) {
    this.hashPassword(val).then((dat) => (this.hashed_pass = dat));
  }

  public get password() {
    return this.hashed_pass;
  }

  public async hashPassword(pass: string) {
    if (!pass) return '';
    try {
      return await hash(pass, parseInt(parseEnv('HASH_SALT')));
    } catch (error) {
      return '';
    }
  }

  public async comparePassword(pass: string) {
    return await compare(pass, this.hashed_pass);
  }
}

export const userModel = getModelForClass(User);
