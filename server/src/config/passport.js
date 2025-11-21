import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./environment.js";
import { findOrCreateUserFromGoogle } from "#services/user-service";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findOrCreateUserFromGoogle(profile);
        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
