import ApiError from '#app/utils/api-error.js';
import httpStatus from 'http-status';
import { asyncHandler } from '#app/utils/async.js';

const validateCreateFeed = asyncHandler(async (req, res, next) => {
  const { content, mediaPublicIds } = req.body;

  if (!content && (!mediaPublicIds || mediaPublicIds.length === 0)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Feed must have either content or media.');
  }

  if (mediaPublicIds && mediaPublicIds.length > 10) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A feed can have a maximum of 10 media items.');
  }

  if (content && content.length > 2000) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Content cannot exceed 2000 characters.');
  }

  next();
});

export { validateCreateFeed };
