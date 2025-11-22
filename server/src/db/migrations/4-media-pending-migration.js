const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("media_pendings", {
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

    cloudinary_public_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },

    type: {
      type: Sequelize.ENUM("image", "video"),
      allowNull: false,
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
  await queryInterface.dropTable("media_pendings");
};

export { up, down };
