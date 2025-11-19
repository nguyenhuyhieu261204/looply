import { env } from "#config";

export const getRefreshTokenKey = (refreshToken) => {
  return `${env.APP_NAME}:refresh_tokens:${refreshToken}`;
};
