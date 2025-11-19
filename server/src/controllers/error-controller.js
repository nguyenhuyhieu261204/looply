import { env } from "#config";
import { returnError } from "#utils";
import httpStatus from "http-status";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";

  return res
    .status(statusCode)
    .json(
      returnError(message, env.NODE_ENV === "development" ? err.stack : null)
    );
};

export const notFoundHandler = (req, res, next) => {
  const message = `${req.originalUrl} not found`;
  return res.status(httpStatus.NOT_FOUND).json(returnError(message));
};
