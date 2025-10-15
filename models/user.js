'use strict';
const { Model } = require('sequelize');
const { createId } = require('@paralleldrive/cuid2');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Organisation, {
        through: models.UserOrganisation,
        foreignKey: 'userId',
        otherKey: 'orgId',
        onDelete: 'CASCADE',
      });
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        defaultValue: () => createId(), // ✅ auto-generate CUID
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phone: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      displayImage: DataTypes.STRING,
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      confirmationCode: DataTypes.STRING,
      confirmationExpires: DataTypes.DATE,
      resetPasswordCode: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'user_account', // ✅ matches DB table
      freezeTableName: true,
    }
  );

  return User;
};
