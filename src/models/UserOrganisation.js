const { DataTypes } = require("sequelize");

module.exports = {
  initialize: (sequelize) => {
    const UserOrganisationModel = {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "user_account", // ✅ corrected
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      orgId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "organisation", // ✅ corrected
          key: "orgId",
        },
        onDelete: "CASCADE",
      },
      role: {
        type: DataTypes.ENUM("owner", "org_admin", "user","system_admin"),
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
