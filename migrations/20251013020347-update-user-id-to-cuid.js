'use strict';
const { createId } = require('@paralleldrive/cuid2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1️⃣ Add temporary CUID column
      await queryInterface.addColumn(
        'user_account',
        'newId',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // 2️⃣ Fetch all existing userIds
      const [users] = await queryInterface.sequelize.query(
        `SELECT "userId" FROM "user_account"`,
        { transaction }
      );

      // 3️⃣ Generate cuid2 for each and update
      for (const user of users) {
        const cuid = createId();
        await queryInterface.sequelize.query(
          `UPDATE "user_account" SET "newId" = :cuid WHERE "userId" = :userId`,
          {
            replacements: { cuid, userId: user.userId },
            transaction,
          }
        );
      }

      // 4️⃣ Commit
      await transaction.commit();
      console.log('✅ Migration completed: All user_account IDs updated successfully.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // ✅ Check if column exists before removing
      const [results] = await queryInterface.sequelize.query(
        `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'user_account' AND column_name = 'newId';
        `,
        { transaction }
      );

      if (results.length > 0) {
        await queryInterface.removeColumn('user_account', 'newId', { transaction });
        console.log('🗑️ Rolled back: newId column removed.');
      } else {
        console.log('⚠️ Skipped: newId column does not exist on user_account.');
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  },
};
