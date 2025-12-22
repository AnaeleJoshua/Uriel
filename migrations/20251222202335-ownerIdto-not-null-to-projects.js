'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Projects', 'ownerId', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Projects', 'ownerId', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
