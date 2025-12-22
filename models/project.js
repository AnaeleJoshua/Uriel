'use strict';
const { Model } = require('sequelize');
const { createId } = require('@paralleldrive/cuid2');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.Organisation, { foreignKey: 'organisationId', as: 'organisation' });
      Project.hasMany(models.Task, { foreignKey: 'projectId', as: 'tasks' });
      Project.hasMany(models.ProjectMember, { foreignKey: 'projectId', as: 'projectMembers' }); // optional if you later add project members
      Project.belongsToMany(models.User, {
  through: models.ProjectMember,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'members'
});

    }
  }

  Project.init(
    {
      projectId: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => createId() },
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      organisationId: { type: DataTypes.STRING, allowNull: false },
      createBy: {
        type: DataTypes.STRING,
        allowNull: false
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // ✅ Soft delete field
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      // ✅ Timestamps
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      // ✅ Owner field
      ownerId: {
        type: DataTypes.STRING,
        allowNull: false
      },
       // ✅ Archive flag
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'Projects',
      paranoid: true,          // ✅ enables soft delete
      timestamps: true         // required for paranoid
    }
  );

  return Project;
};
