import { asyncHandler, returnError } from "#utils";
import passport from "passport";
import httpStatus from "http-status";
import { env, models } from "#config";
import { createUserWithUniqueUsername } from "#services/user-service";
import { generateAccessTokenAndRefreshToken } from "#services/token-service";
import { setRefreshTokenCookie } from "#utils/cookie";

const { User } = models;

/**
 * Tạo hoặc cập nhật user từ google profile
 * - Nếu user tồn tại → cập nhật thông tin và lastActive
 * - Nếu chưa tồn tại → tạo mới user với username unique
 */
async function findOrCreateUserFromGoogle(googleProfile) {
  let user = await User.findOne({ where: { googleId: googleProfile.id } });

  const userData = {
    email: googleProfile.emails[0].value,
    fullName: googleProfile.displayName,
    googleId: googleProfile.id,
    profilePicture: googleProfile.photos[0].value,
    lastActive: new Date(),
  };

  if (!user) {
    // Tạo mới user, xử lý race condition trong service
    user = await createUserWithUniqueUsername(userData);
  } else {
    // Cập nhật thông tin nếu có thay đổi
    let updated = false;
    for (const key of ["email", "fullName", "profilePicture"]) {
      if (user[key] !== userData[key]) {
        user[key] = userData[key];
        updated = true;
      }
    }
    if (updated || !user.lastActive) {
      user.lastActive = new Date();
      await user.save();
    }
  }

  return user;
}

/**
 * Login with Google handler
 */
export const loginWithGoogleHandler = asyncHandler(async (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err, googleProfile, info) => {
      try {
        if (err) {
          console.error("Passport error:", err);
          return next(err);
        }

        if (!googleProfile) {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .json(returnError("Google login failed", httpStatus.UNAUTHORIZED));
        }

        // 1️⃣ Tìm hoặc tạo user
        let user = await findOrCreateUserFromGoogle(googleProfile);

        // 2️⃣ Tạo access token & refresh token
        const { accessToken, refreshToken } =
          await generateAccessTokenAndRefreshToken(user);

        // 3️⃣ Lưu refresh token vào cookie
        setRefreshTokenCookie(res, refreshToken);

        // 4️⃣ Chuẩn hóa dữ liệu user trả về
        user = user.toJSON();
        delete user.googleId;

        const oauthResult = {
          type: "OAUTH_SUCCESS",
          payload: {
            user,
            accessToken,
          },
        };

        // 5️⃣ Gửi postMessage về frontend (popup) an toàn
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
    }
  )(req, res, next);
});
