'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.renameColumn(
      'schedules',
      'author_id',
      'user_id'
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'schedules',
      'user_id',
      'author_id'
    );
  }
};
