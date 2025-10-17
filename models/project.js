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
      organisationId: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'Projects'
    }
  );

  return Project;
};
