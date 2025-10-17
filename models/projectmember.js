'use strict';
const { Model } = require('sequelize');
const { createId } = require('@paralleldrive/cuid2');

module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    static associate(models) {
      ProjectMember.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      ProjectMember.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  ProjectMember.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => createId()
    },
    projectId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('member', 'lead','owner'),
      defaultValue: 'member'
    },
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ProjectMember',
    tableName: 'ProjectMembers'
  });

  return ProjectMember;
};
