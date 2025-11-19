import { env } from "#config";

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/auth",
    maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000,
  });
};
