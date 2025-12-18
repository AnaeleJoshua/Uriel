'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Map newUserId from user_account table
      await queryInterface.sequelize.query(
        `
        UPDATE "user_organisation" uo
        SET "newUserId" = u."newId"
        FROM "user_account" u
        WHERE uo."userId" = u."userId";
        `,
        { transaction }
      );

      // Map newOrganisationId from organisation table
      await queryInterface.sequelize.query(
        `
        UPDATE "user_organisation" uo
        SET "newOrganisationId" = o."newId"
        FROM "organisation" o
        WHERE uo."orgId" = o."orgId";
        `,
        { transaction }
      );

      await transaction.commit();
      console.log('✅ userOrganisation mapping completed successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed during userOrganisation mapping:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tableName = 'user_organisation';

      // Check table structure before attempting to drop columns
      const table = await queryInterface.describeTable(tableName);

      // Optionally clear the new IDs if columns exist
      if (table.newUserId && table.newOrganisationId) {
        await queryInterface.sequelize.query(
          `
          UPDATE "${tableName}"
          SET "newUserId" = NULL, "newOrganisationId" = NULL;
          `,
          { transaction }
        );
      }

      // Drop columns only if they exist
      if (table.newUserId) {
        await queryInterface.removeColumn(tableName, 'newUserId', { transaction });
      }

      if (table.newOrganisationId) {
        await queryInterface.removeColumn(tableName, 'newOrganisationId', { transaction });
      }

      console.log('🗑️ Reverted userOrganisation new ID mappings.');
    });
  },
};
