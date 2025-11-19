import { Model } from "sequelize";

export const UserFN = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Email is not valid",
          },
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
        },
      },

      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Full name is required",
          },
          notEmpty: {
            msg: "Full name is required",
          },
          len: {
            args: [3, 255],
            msg: "Full name must be between 3 and 255 characters",
          },
        },
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Username is required",
          },
          notEmpty: {
            msg: "Username is required",
          },
          len: {
            args: [3, 255],
            msg: "Username must be between 3 and 255 characters",
          },
          is: {
            args: /^[a-z0-9_-]+$/,
            msg: "Username must be lowercase letters, numbers, underscores, and hyphens",
          },
        },
      },

      googleId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: "Bio must be between 0 and 500 characters",
          },
        },
      },

      profilePicture: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isUrl: {
            msg: "Profile picture must be a valid URL",
          },
        },
      },

      coverPicture: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isUrl: {
            msg: "Cover picture must be a valid URL",
          },
        },
      },

      location: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: "Location must be between 0 and 255 characters",
          },
        },
      },

      isPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      lastActive: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};
