'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {}

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log('🔄 Updating organisation.newOwnerId with corresponding CUIDs...');

      // Update organisation.newOwnerId by joining with user_account
      await queryInterface.sequelize.query(
        `
        UPDATE "organisation" AS o
        SET "newOwnerId" = u."newId"
        FROM "user_account" AS u
        WHERE o."ownerId" = u."userId";
        `,
        { transaction }
      );

      await transaction.commit();
      console.log('✅ organisation.newOwnerId updated successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Failed to update organisation.newOwnerId:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `UPDATE "organisation" SET "newOwnerId" = NULL;`,
        { transaction }
      );
      await transaction.commit();
      console.log('🗑️ Rolled back organisation.newOwnerId updates.');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

  

  
