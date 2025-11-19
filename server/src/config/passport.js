import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./environment.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport;
