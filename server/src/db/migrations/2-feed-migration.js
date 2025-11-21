const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("feeds", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    content: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    is_moderated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    moderation_score: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    is_public: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
  await queryInterface.dropTable("feeds");
};

export { up, down };

//
