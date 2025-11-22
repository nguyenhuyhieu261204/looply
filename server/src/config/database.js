import { DataTypes, Sequelize } from "sequelize";
import { env } from "./environment.js";
import { UserFN, FeedFN, FeedMediaFN, MediaPendingFN } from "#models";

const dbConfigs = {
  development: {
    url: `${env.DATABASE_URL}_${env.NODE_ENV}`,
  },
  test: {
    url: `${env.DATABASE_URL}_${env.NODE_ENV}`,
  },
  production: {
    url: env.DATABASE_URL,
  },
};

const sequelize = new Sequelize(dbConfigs[env.NODE_ENV].url, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions:
    env.NODE_ENV === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: true,
          },
        }
      : {},
  logging: env.NODE_ENV === "development",
});

const modelFns = {
  User: UserFN,
  Feed: FeedFN,
  FeedMedia: FeedMediaFN,
  MediaPending: MediaPendingFN,
};

const models = {};

for (const modelName in modelFns) {
  models[modelName] = modelFns[modelName](sequelize, DataTypes);
}

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅Connection has been established successfully.");
  } catch (error) {
    console.error("❌Unable to connect to the database:", error);
  }
})();

const closePGConnection = async () => {
  try {
    await sequelize.close();
    console.log("✅Connection has been closed successfully.");
  } catch (error) {
    console.error("❌Unable to close the database connection:", error);
  }
};

export { sequelize, closePGConnection, models };
export default dbConfigs;
