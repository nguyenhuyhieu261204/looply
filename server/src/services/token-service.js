import jwt from "jsonwebtoken";
import { env, redis } from "#config";
import { getRefreshTokenKey } from "#utils/key";

export const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    algorithm: "HS256",
  });
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    algorithm: "HS256",
  });
};

export const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const saveRefreshToken = async (refreshToken, userId) => {
  const key = getRefreshTokenKey(refreshToken);

  try {
    await redis.hset(key, { userId, loginTime: Date.now().toString() });
    await redis.expire(key, env.REFRESH_TOKEN_EXPIRES_IN);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const revokeRefreshToken = async (refreshToken) => {
  const key = getRefreshTokenKey(refreshToken);

  try {
    await redis.del(key);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generateAccessTokenAndRefreshToken = async (user) => {
  const payload = { userId: user.id };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await saveRefreshToken(refreshToken, user.id);

  return { accessToken, refreshToken };
};
