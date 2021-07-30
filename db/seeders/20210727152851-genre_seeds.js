'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:

    */
    return queryInterface.bulkInsert('Genres', [
      { name: 'Sandbox', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Real-time Strategy', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Shooters', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Multiplayer online battle arena', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Role-Playing', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sports', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Puzzle', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Party', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Action-adventure', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Survival and Horror', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Platformer', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Simulation', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fighting', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Roguelike', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Genres', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};
