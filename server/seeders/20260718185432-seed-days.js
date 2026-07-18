'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('days', [
      {name: 'monday', createdAt: new Date(), updatedAt: new Date() },
      {name: 'tueday', createdAt: new Date(), updatedAt: new Date() },
      {name: 'wednesday', createdAt: new Date(), updatedAt: new Date() },
      {name: 'thursday', createdAt: new Date(), updatedAt: new Date() },
      {name: 'friday', createdAt: new Date(), updatedAt: new Date() },
      {name: 'saturday', createdAt: new Date(), updatedAt: new Date() },
      {name: 'sunday', createdAt: new Date(), updatedAt: new Date() },

    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('days', null, {});
  }
};
