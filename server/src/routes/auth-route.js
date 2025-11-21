import express from "express";
import {
  loginWithGoogleHandler,
  refreshAccessToken,
  getMe,
} from "#controllers/auth-controller";
import passport from "passport";
import { protect } from "#middlewares/auth-middleware";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  loginWithGoogleHandler
);

router.post("/refresh-token", refreshAccessToken);

router.get("/me", protect, getMe);

export default router;
