'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'plans',
      'schedule_id',
      {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'plans',
      'schedule_id',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    );
  }
};
