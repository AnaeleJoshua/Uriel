'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'createdBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Projects', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    }); 
    
    await queryInterface.addColumn('Projects','ownerId',{
      type: Sequelize.STRING,
      allowNull: true
    }); 
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Projects', 'createdBy');
        await queryInterface.removeColumn('Projects', 'updatedBy');
        await queryInterface.removeColumn('Projects', 'ownerId');
  }
};
