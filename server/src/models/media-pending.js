import { Model } from "sequelize";

export const MediaPendingFN = (sequelize, DataTypes) => {
  class MediaPending extends Model {
    static associate(models) {
      MediaPending.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "owner",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  MediaPending.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID is required" },
          isInt: { msg: "User ID must be an integer" },
        },
      },

      cloudinaryPublicId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Cloudinary public ID is required" },
          notEmpty: { msg: "Cloudinary public ID cannot be empty" },
        },
      },

      type: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
        validate: {
          notNull: { msg: "Type is required" },
          notEmpty: { msg: "Type cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "MediaPending",
      tableName: "media_pendings",
      timestamps: true,
      underscored: true,
    }
  );

  return MediaPending;
};
