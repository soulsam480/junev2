import { Application } from 'express';
import passport from 'passport';
import { setupGoogleOauth } from 'src/oauth/google';

export function setupOauth(app: Application) {
  setupGoogleOauth(passport);

  app.use(passport.initialize());
}
