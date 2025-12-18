'use strict';
const { Model } = require('sequelize');
const { createId } = require('@paralleldrive/cuid2');

module.exports = (sequelize, DataTypes) => {
  class TaskAssignment extends Model {
    static associate(models) {
      TaskAssignment.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
      TaskAssignment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  TaskAssignment.init(
    {
      taskAssignmentId: { type: DataTypes.STRING, primaryKey: true, allowNull: false, defaultValue: () => createId() },
      taskId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
      assignedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      sequelize,
      modelName: 'TaskAssignment',
      tableName: 'TaskAssignments'
    }
  );

  return TaskAssignment;
};
