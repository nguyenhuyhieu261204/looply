import { Model } from "sequelize";

export const FeedMediaFN = (sequelize, DataTypes) => {
  class FeedMedia extends Model {
    static associate(models) {
      FeedMedia.belongsTo(models.Feed, {
        foreignKey: "feedId",
        targetKey: "id",
        as: "feed",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  FeedMedia.init(
    {
      feedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Feed ID is required" },
          isInt: { msg: "Feed ID must be an integer" },
        },
      },

      cloudinaryPublicId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { notEmpty: { msg: "Cloudinary public ID is required" } },
      },

      url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "URL is required" },
          isUrl: { msg: "URL is not valid" },
        },
      },

      thumbnailUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isUrl: { msg: "Thumbnail URL is not valid" },
        },
      },

      type: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
        validate: { notEmpty: { msg: "Type is required" } },
      },

      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { isInt: true },
      },

      width: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { isInt: true },
      },

      duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: { isFloat: true },
      },
    },
    {
      sequelize,
      modelName: "FeedMedia",
      tableName: "feed_medias",
      timestamps: true,
      underscored: true,
    }
  );

  return FeedMedia;
};
