import { asyncHandler, returnSuccess } from "#utils";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import httpStatus from "http-status";
import { env, models } from "#config";

const { MediaPending } = models;

/**
 * Generate upload signatures for multiple media files
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadSignaturesHandler = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { medias = [] } = req.body;

  const signatures = [];
  const mediaPendings = [];

  medias.map(async (media, i) => {
    const publicId = uuidv4();
    const folder = `${env.APP_NAME}/feeds/tmp`;
    const timestamp = Math.round(Date.now() / 1000);

    const params = {
      folder,
      timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      env.CLOUDINARY_API_SECRET
    );

    signatures.push({
      signature,
      timestamp,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      publicId,
      folder,
      type: media.type,
      order: i,
    });

    mediaPendings.push({
      userId,
      cloudinaryPublicId: publicId,
      type: media.type,
    });
  });

  await MediaPending.bulkCreate(mediaPendings);

  return res
    .status(httpStatus.OK)
    .json(
      returnSuccess("Upload signatures generated successfully.", signatures)
    );
});

export const createFeed = asyncHandler(async (req, res) => {});
