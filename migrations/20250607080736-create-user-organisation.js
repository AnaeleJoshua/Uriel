'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_organisation', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user_account',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      orgId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organisation',
          key: 'orgId',
        },
        onDelete: 'CASCADE',
      },
      role: {
        type: Sequelize.ENUM('owner', 'admin', 'user'),
        defaultValue: 'user',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Add composite primary key
    await queryInterface.addConstraint('user_organisation', {
      fields: ['userId', 'orgId'],
      type: 'primary key',
      name: 'user_organisation_pkey',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_organisation');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_organisation_role";'
    );
  },
};

