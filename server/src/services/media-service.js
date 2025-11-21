import { MediaPending } from '#app/models/index.js';
import { Op } from 'sequelize';

const createPendingMedia = async (userId, publicId, type = 'image') => {
  const media = await MediaPending.create({
    userId,
    cloudinaryPublicId: publicId,
    type,
  });
  return media;
};

const getMediasByPublicIds = async (publicIds, { userId, transaction } = {}) => {
  const medias = await MediaPending.findAll({
    where: {
      cloudinaryPublicId: {
        [Op.in]: publicIds,
      },
      userId,
    },
    transaction,
  });

  return medias;
};

export { createPendingMedia, getMediasByPublicIds };
