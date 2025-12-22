'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        'ProjectMembers',
        'isActive',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'ProjectMembers',
        'removedAt',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'ProjectMembers',
        'removedBy',
        {
          type: Sequelize.STRING,
          allowNull: true
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('ProjectMembers', 'removedBy', {
        transaction
      });

      await queryInterface.removeColumn('ProjectMembers', 'removedAt', {
        transaction
      });

      await queryInterface.removeColumn('ProjectMembers', 'isActive', {
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
