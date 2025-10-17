'use strict';
const { Model } = require('sequelize');
const { createId } = require('@paralleldrive/cuid2');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 🏢 User ↔ Organisation
      this.belongsToMany(models.Organisation, {
        through: models.UserOrganisation,
        foreignKey: 'userId',
        otherKey: 'orgId',
        as: 'organisations',
        onDelete: 'CASCADE',
      });

      // 📋 User → Tasks they created
      this.hasMany(models.Task, {
        foreignKey: 'createdBy',
        as: 'createdTasks'
      });

      // 👥 User ↔ Tasks assigned to them
      this.belongsToMany(models.Task, {
        through: models.TaskAssignment,
        foreignKey: 'userId',
        otherKey: 'taskId',
        as: 'assignedTasks'
      });

      // 🚀 User ↔ Projects they belong to
      this.belongsToMany(models.Project, {
        through: models.ProjectMember,
        foreignKey: 'userId',
        otherKey: 'projectId',
        as: 'projects'
      });
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        defaultValue: () => createId(),
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
      tableName: 'user_account',
      freezeTableName: true,
    }
  );

  return User;
};
