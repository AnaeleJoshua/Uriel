const { DataTypes } = require("sequelize");

module.exports = {
  initialize: (sequelize) => {
    const UserOrganisationModel = {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account", // ✅ corrected
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "organisation", // ✅ corrected
          key: "orgId",
        },
        onDelete: "CASCADE",
      },
      role: {
        type: DataTypes.ENUM("owner", "admin", "user"),
        defaultValue: "user",
      },
    };

    const UserOrganisation = sequelize.define("userOrganisation", UserOrganisationModel, {
      tableName: "user_organisation",
      freezeTableName: true,
    });

    return UserOrganisation;
  },
};
