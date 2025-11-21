import { env } from "#config";

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000,
    domain: new URL(env.FRONTEND_URL).hostname,
  });
};
