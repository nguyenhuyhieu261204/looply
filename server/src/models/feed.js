import { Model } from "sequelize";

export const FeedFN = (sequelize, DataTypes) => {
  class Feed extends Model {
    static associate(models) {
      Feed.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "owner",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Feed.hasMany(models.FeedMedia, {
        foreignKey: "feedId",
        sourceKey: "id",
        as: "medias",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Feed.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID is required" },
          isInt: { msg: "User ID must be an integer" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: { msg: "Content cannot be empty" },
        },
      },
      isModerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      moderationScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
          isFloat: { msg: "Moderation score must be a float" },
          min: { args: [0], msg: "Moderation score must be at least 0" },
          max: { args: [1], msg: "Moderation score must be at most 1" },
        },
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Feed",
      tableName: "feeds",
      timestamps: true,
      underscored: true,
    }
  );

  return Feed;
};
