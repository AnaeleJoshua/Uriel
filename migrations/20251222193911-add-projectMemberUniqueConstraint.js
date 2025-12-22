'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('ProjectMembers', {
  fields: ['projectId', 'userId'],
  type: 'unique',
  name: 'unique_project_user_membership'
});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('ProjectMembers', 'unique_project_user_membership');
  }
};
