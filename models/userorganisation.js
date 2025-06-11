'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserOrganisation extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  UserOrganisation.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user_account",
        key: "userId",
      },
      onDelete: "CASCADE",
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "organisation",
        key: "orgId",
      },
      onDelete: "CASCADE",
    },
    role: {
      type: DataTypes.ENUM("owner", "admin", "user"),
      defaultValue: "user",
    }
  }, {
    sequelize,
    modelName: 'UserOrganisation',
    tableName: 'user_organisation',
    freezeTableName: true,
  });

  return UserOrganisation;
};
