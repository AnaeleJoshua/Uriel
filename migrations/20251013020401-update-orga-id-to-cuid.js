'use strict';

const { createId } = require('@paralleldrive/cuid2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1️⃣ Add nullable temporary columns
      await queryInterface.addColumn(
        'organisation',
        'newId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'organisation',
        'newOwnerId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // 2️⃣ Fetch all existing organisations
      const [organisations] = await queryInterface.sequelize.query(
        `SELECT "orgId", "ownerId" FROM "organisation";`,
        { transaction }
      );

      // 3️⃣ Generate cuid for each organisation and update owner mapping
      for (const org of organisations) {
        const cuid = createId();

        await queryInterface.sequelize.query(
          `
          UPDATE "organisation"
          SET "newId" = :cuid,
              "newOwnerId" = (
                SELECT "newId"
                FROM "user_account"
                WHERE "userId" = :ownerId
              )
          WHERE "orgId" = :orgId;
          `,
          {
            replacements: { cuid, ownerId: org.ownerId, orgId: org.orgId },
            transaction,
          }
        );
      }

      await transaction.commit();
      console.log('✅ organisation table newId and newOwnerId populated successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error during organisation migration:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableInfo = await queryInterface.describeTable('organisation');

      if (tableInfo.newOwnerId) {
        await queryInterface.removeColumn('organisation', 'newOwnerId', { transaction });
        console.log('🗑️ Column newOwnerId removed safely.');
      }

      if (tableInfo.newId) {
        await queryInterface.removeColumn('organisation', 'newId', { transaction });
        console.log('🗑️ Column newId removed safely.');
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error('❌ Error during rollback of organisation migration:', err);
      throw err;
    }
  },
};
