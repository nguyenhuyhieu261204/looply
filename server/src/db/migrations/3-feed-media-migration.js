const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("feed_medias", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    feed_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "feeds",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    cloudinary_public_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },

    url: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    thumbnail_url: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    type: {
      type: Sequelize.ENUM("image", "video"),
      allowNull: false,
    },

    height: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    width: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    duration: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
};

const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable("feed_medias");
};

export { up, down };

//
