import express from "express";
import { loginWithGoogleHandler } from "#controllers/auth-controller";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get("/google/callback", loginWithGoogleHandler);

export default router;
