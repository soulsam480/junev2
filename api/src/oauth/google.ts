import { PassportStatic } from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { userModel } from 'src/entities/user';
import { parseEnv } from 'src/utils/helpers';

export function setupGoogleOauth(passportInstance: PassportStatic) {
  passportInstance.use(
    new Strategy(
      {
        clientID: parseEnv('GCLIENT_ID'),
        clientSecret: parseEnv('GCLIENT_SECRET'),
        callbackURL: !process.env.PROD
          ? 'http://localhost:3000/auth/google/redirect'
          : parseEnv('GAUTH_REDIRECT'),
        passReqToCallback: true,
      },
      async (_: any, __: any, ___: any, profile: Record<string, string>, done: any) => {
        const user = await userModel.findOne({
          $or: [{ email: profile.email }, { ga_id: profile.id }],
        });
        if (!user) {
          userModel
            .create({
              name: profile.displayName,
              email: profile.email,
              ga_id: profile.id,
              username: profile.email.split('@')[0],
              password: profile.email.split('@')[0],
            })
            .then((user) => done(null, user.toJSON()));
          return;
        }

        if (!user.ga_id)
          await userModel.findOneAndUpdate({ email: user.email }, { ga_id: profile.id });

        done(null, user.toJSON());
      },
    ),
  );

  passportInstance.serializeUser((user, cb) => {
    cb(null, (user as any).id);
  });

  passportInstance.deserializeUser(async (id: string, cb) => {
    const user = await userModel.findOne({ id });
    if (!user) return;
    cb(null, user.toJSON());
  });
}
