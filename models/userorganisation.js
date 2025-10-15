'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserOrganisation extends Model {
    static associate(models) {
      // Define associations explicitly for clarity
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      this.belongsTo(models.Organisation, {
        foreignKey: 'orgId',
        onDelete: 'CASCADE',
      });
    }
  }

  UserOrganisation.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'user_account', // ✅ matches actual table name
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      orgId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'organisation', // ✅ matches actual table name
          key: 'orgId',
        },
        onDelete: 'CASCADE',
      },
      role: {
        type: DataTypes.ENUM('owner', 'org_admin', 'user', 'system_admin'),
        defaultValue: 'user',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserOrganisation',
      tableName: 'user_organisation',
      freezeTableName: true,
      timestamps: true, // ✅ recommended for tracking changes
    }
  );

  return UserOrganisation;
};
