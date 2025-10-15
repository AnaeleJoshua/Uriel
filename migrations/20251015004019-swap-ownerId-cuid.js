'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('🔧 Replacing organisation.ownerId (int) with newOwnerId (CUID)...');

      // 1️⃣ Drop existing foreign key constraint (if it exists)
      await queryInterface.sequelize.query(`
        ALTER TABLE "organisation" 
        DROP CONSTRAINT IF EXISTS "organisation_ownerId_fkey";
      `, { transaction });

      // 2️⃣ Drop old ownerId column
      await queryInterface.removeColumn('organisation', 'ownerId', { transaction });

      // 3️⃣ Rename newOwnerId → ownerId
      await queryInterface.renameColumn('organisation', 'newOwnerId', 'ownerId', { transaction });

      // 4️⃣ Add new foreign key constraint to user_account.userId (CUID)
      await queryInterface.sequelize.query(`
        ALTER TABLE "organisation"
        ADD CONSTRAINT "organisation_ownerId_fkey"
        FOREIGN KEY ("ownerId")
        REFERENCES "user_account" ("userId")
        ON DELETE CASCADE
        ON UPDATE CASCADE;
      `, { transaction });

      await transaction.commit();
      console.log('✅ organisation.ownerId successfully converted to CUID and linked to user_account.userId.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed while replacing ownerId:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('🗑️ Reverting ownerId CUID replacement...');

      // 1️⃣ Drop new FK constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE "organisation" 
        DROP CONSTRAINT IF EXISTS "organisation_ownerId_fkey";
      `, { transaction });

      // 2️⃣ Rename ownerId → newOwnerId (restore previous state)
      await queryInterface.renameColumn('organisation', 'ownerId', 'newOwnerId', { transaction });

      // 3️⃣ Re-add integer ownerId column (optional)
      await queryInterface.addColumn('organisation', 'ownerId', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }, { transaction });

      await transaction.commit();
      console.log('✅ Reverted ownerId replacement migration.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed for ownerId replacement:', error);
      throw error;
    }
  },
};
