const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    google_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    bio: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    profile_picture: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    cover_picture: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    is_private: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    last_active: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
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
  await queryInterface.dropTable("users");
};

export { up, down };
