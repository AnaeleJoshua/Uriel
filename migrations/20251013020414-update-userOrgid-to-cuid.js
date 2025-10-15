'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add newUserId column if not exists
      const table = await queryInterface.describeTable('user_organisation');

      if (!table.newUserId) {
        await queryInterface.addColumn(
          'user_organisation',
          'newUserId',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      // Add newOrganisationId column if not exists
      if (!table.newOrganisationId) {
        await queryInterface.addColumn(
          'user_organisation',
          'newOrganisationId',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction }
        );
      }

      await transaction.commit();
      console.log('✅ Columns newUserId and newOrganisationId added successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed while adding new columns:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const table = await queryInterface.describeTable('user_organisation');

      // Remove only if they exist
      if (table.newUserId) {
        await queryInterface.removeColumn('user_organisation', 'newUserId', { transaction });
      }

      if (table.newOrganisationId) {
        await queryInterface.removeColumn('user_organisation', 'newOrganisationId', { transaction });
      }

      await transaction.commit();
      console.log('🗑️ Columns newUserId and newOrganisationId removed safely.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  },
};
