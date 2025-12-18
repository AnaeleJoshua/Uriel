'use strict';
const { Model } = require('sequelize');
const { createId } = require('@paralleldrive/cuid2');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      Task.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
      Task.belongsToMany(models.User, {
        through: models.TaskAssignment,
        foreignKey: 'taskId',
        otherKey: 'userId',
        as: 'assignedUsers'
      });
      Task.hasMany(models.TaskAssignment, { foreignKey: 'taskId', as: 'assignments' });
    }
  }

  Task.init(
    {
      taskId: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => createId() },
      title: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      status: { type: DataTypes.ENUM('todo','in_progress','done'), defaultValue: 'todo' },
      dueDate: DataTypes.DATE,
      projectId: { type: DataTypes.STRING, allowNull: false },
      createdBy: { type: DataTypes.STRING, allowNull: false }
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'Tasks'
    }
  );

  return Task;
};
