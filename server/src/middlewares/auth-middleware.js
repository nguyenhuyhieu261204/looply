import { verifyAccessToken } from "#services/token-service";
import { ApiError, asyncHandler } from "#utils";
import httpStatus from "http-status";
import { models } from "#config";

const { User } = models;

export const protect = asyncHandler(async (req, res, next) => {
  const headerAuth = req.headers.authorization;

  if (!headerAuth || !headerAuth.startsWith("Bearer ")) {
    throw new ApiError(
      "Please log in to access this resource",
      httpStatus.UNAUTHORIZED
    );
  }

  const token = headerAuth.split(" ")[1];
  if (!token) {
    throw new ApiError(
      "Please log in to access this resource",
      httpStatus.UNAUTHORIZED
    );
  }

  let decoded;
  try {
    decoded = await verifyAccessToken(token);
  } catch (error) {
    throw new ApiError("Invalid or expired token", httpStatus.UNAUTHORIZED);
  }

  if (!decoded || !decoded.userId) {
    throw new ApiError("Invalid token", httpStatus.UNAUTHORIZED);
  }

  const user = await User.findByPk(decoded.userId);

  if (!user) {
    throw new ApiError("User not found", httpStatus.UNAUTHORIZED);
  }

  req.user = user;
  next();
});
