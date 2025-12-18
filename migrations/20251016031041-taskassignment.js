'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskAssignments', {
      taskAssignmentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      taskId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'taskId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'user_account',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      assignedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskAssignments');
  }
};
