'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log('🔧 Starting ID replacement migration...');
      await queryInterface.sequelize.query(`
  ALTER TABLE "organisation" DROP CONSTRAINT IF EXISTS "organisation_ownerId_fkey";
`);
        

      // 1️⃣ Drop existing foreign keys in userOrganisation
      await queryInterface.sequelize.query(`
        ALTER TABLE "user_organisation" DROP CONSTRAINT IF EXISTS "user_organisation_userId_fkey";
        ALTER TABLE "user_organisation" DROP CONSTRAINT IF EXISTS "user_organisation_orgId_fkey";
      `, { transaction });

      // 2️⃣ Drop old primary keys & id columns, then rename new ones
      await queryInterface.sequelize.query(`
        ALTER TABLE "user_account" DROP CONSTRAINT IF EXISTS "user_account_pkey";
        ALTER TABLE "user_account" DROP COLUMN "userId";
        ALTER TABLE "user_account" RENAME COLUMN "newId" TO "userId";
        ALTER TABLE "user_account" ADD PRIMARY KEY ("userId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE "organisation" DROP CONSTRAINT IF EXISTS "organisation_pkey";
        ALTER TABLE "organisation" DROP COLUMN "orgId";
        ALTER TABLE "organisation" RENAME COLUMN "newId" TO "orgId";
        ALTER TABLE "organisation" ADD PRIMARY KEY ("orgId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE "user_organisation" DROP CONSTRAINT IF EXISTS "userOrganisation_pkey";
        ALTER TABLE "user_organisation" DROP COLUMN "userId";
        ALTER TABLE "user_organisation" DROP COLUMN "orgId";
        ALTER TABLE "user_organisation" RENAME COLUMN "newUserId" TO "userId";
        ALTER TABLE "user_organisation" RENAME COLUMN "newOrganisationId" TO "orgId";
        ALTER TABLE "user_organisation" ADD PRIMARY KEY ("userId", "orgId");
      `, { transaction });

      // 3️⃣ Recreate foreign key constraints
      await queryInterface.sequelize.query(`
        ALTER TABLE "user_organisation"
        ADD CONSTRAINT "user_organisation_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "user_account" ("userId")
        ON DELETE CASCADE ON UPDATE CASCADE;

        ALTER TABLE "user_organisation"
        ADD CONSTRAINT "user_organisation_orgId_fkey"
        FOREIGN KEY ("orgId") REFERENCES "organisation" ("orgId")
        ON DELETE CASCADE ON UPDATE CASCADE;
      `, { transaction });

      await transaction.commit();
      console.log('✅ ID replacement completed successfully!');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed during ID replacement:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      console.log('🗑️ Reverting ID replacement...');

      await queryInterface.sequelize.query(`
        ALTER TABLE "user_organisation" DROP CONSTRAINT IF EXISTS "user_organisation_userId_fkey";
        ALTER TABLE "user_organisation" DROP CONSTRAINT IF EXISTS "user_organisation_orgId_fkey";
      `, { transaction });

      // Revert column renames (optional depending on your rollback strategy)
      await queryInterface.sequelize.query(`
        ALTER TABLE "user_account" DROP CONSTRAINT IF EXISTS "user_account_pkey";
        ALTER TABLE "user_account" RENAME COLUMN "userId" TO "oldUserId";
        ALTER TABLE "user_account" ADD PRIMARY KEY ("oldUserId");
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE "organisation" DROP CONSTRAINT IF EXISTS "organisation_pkey";
        ALTER TABLE "organisation" RENAME COLUMN "orgId" TO "oldOrgId";
        ALTER TABLE "organisation" ADD PRIMARY KEY ("oldOrgId");
      `, { transaction });

      await transaction.commit();
      console.log('✅ Reverted ID replacement migration.');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  },
};
