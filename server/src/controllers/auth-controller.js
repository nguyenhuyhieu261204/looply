import {
  generateAccessToken,
  verifyRefreshToken,
} from "#services/token-service";
import { asyncHandler, returnError, returnSuccess } from "#utils";
import passport from "passport";
import httpStatus from "http-status";
import { env, models } from "#config";
import { createUserWithUniqueUsername } from "#services/user-service";
import { generateAccessTokenAndRefreshToken } from "#services/token-service";
import { setRefreshTokenCookie } from "#utils/cookie";

const { User } = models;

export const loginWithGoogleHandler = asyncHandler(async (req, res, next) => {
  try {
    let user = req.user;

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);

    user = user.toJSON();
    delete user.googleId;

    const oauthResult = {
      type: "OAUTH_SUCCESS",
      payload: {
        user,
        accessToken,
      },
    };

    const safeJson = JSON.stringify(oauthResult).replace(/</g, "\\u003c");

    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Complete</title></head>
        <body>
          <p>Authentication successful! Closing window...</p>
          <script>
            try {
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage(${safeJson}, "${env.FRONTEND_URL}");
                window.close();
              }
            } catch (error) {
              console.error("Error posting message to opener:", error);
              window.close();
            }
          </script>
        </body>
        </html>
      `);
  } catch (error) {
    console.error("Error in loginWithGoogleHandler:", error);

    const errorResult = {
      type: "OAUTH_FAILED",
      payload: {
        message: "Google login failed",
        error: error.message || error,
      },
    };
    const safeJson = JSON.stringify(errorResult).replace(/</g, "\\u003c");

    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Failed</title></head>
        <body>
          <p>Authentication failed. Closing window...</p>
          <script>
            try {
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage(${safeJson}, "${env.FRONTEND_URL}");
                window.close();
              }
            } catch (err) {
              console.error("Error posting message to opener:", err);
              window.close();
            }
          </script>
        </body>
        </html>
      `);
  }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(
        returnError(
          "Refresh token not found. Please log in again.",
          httpStatus.UNAUTHORIZED
        )
      );
  }

  let decoded;
  try {
    decoded = await verifyRefreshToken(refreshToken);
  } catch (error) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json(
        returnError(
          "Invalid or expired refresh token. Please log in again.",
          httpStatus.FORBIDDEN
        )
      );
  }

  const user = await User.findByPk(decoded.userId);

  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(
        returnError(
          "User not found with provided refresh token.",
          httpStatus.UNAUTHORIZED
        )
      );
  }

  const newAccessToken = generateAccessToken(user);

  return res.status(httpStatus.OK).json(
    returnSuccess("Access token refreshed successfully.", {
      accessToken: newAccessToken,
      user,
    })
  );
});

export const getMe = asyncHandler(async (req, res) => {
  return res
    .status(httpStatus.OK)
    .json(
      returnSuccess("Current user fetched successfully.", { user: req.user })
    );
});
