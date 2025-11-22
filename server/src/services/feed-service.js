import { Feed, FeedMedia, MediaPending, User } from '#app/models/index.js';
import { sequelize } from '#app/config/database.js';
import ApiError from '#app/utils/api-error.js';
import httpStatus from 'http-status';
import { getMediasByPublicIds } from './media-service.js';
import { cloudinary } from '#app/config/index.js';

const buildCloudinaryUrl = (publicId, type) => {
  const cloudName = cloudinary.config.cloud_name;
  const resourceType = type === 'video' ? 'video' : 'image';
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${publicId}`;
};

const createFeed = async (userId, { content, isPublic, mediaPublicIds }) => {
  const t = await sequelize.transaction();

  try {
    const feed = await Feed.create(
      {
        userId,
        content,
        isPublic,
      },
      { transaction: t }
    );

    if (mediaPublicIds && mediaPublicIds.length > 0) {
      const pendingMedias = await getMediasByPublicIds(mediaPublicIds, {
        userId,
        transaction: t,
      });

      if (pendingMedias.length !== mediaPublicIds.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'One or more media is invalid');
      }

      await FeedMedia.bulkCreate(
        pendingMedias.map((media) => ({
          feedId: feed.id,
          cloudinaryPublicId: media.cloudinaryPublicId,
          type: media.type,
          url: buildCloudinaryUrl(media.cloudinaryPublicId, media.type),
        })),
        { transaction: t }
      );

      await MediaPending.destroy({
        where: {
          cloudinaryPublicId: mediaPublicIds,
          userId,
        },
        transaction: t,
      });
    }

    await t.commit();

    const result = await Feed.findByPk(feed.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'avatar'],
        },
        {
          model: FeedMedia,
          as: 'medias',
        },
      ],
    });

    return result;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export { createFeed };
