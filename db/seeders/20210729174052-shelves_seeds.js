'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    { name: 'All', userId: 1, removable: false }
    { name: 'Want to play', userId: 1, removable: false }
    { name: 'Currently Playing', userId: 1, removable: false }
    { name: 'Played', userId: 1, removable: false }
      Example:
      */
      return queryInterface.bulkInsert('Gameshelves', [
      { name: 'All', userId: 1, removable: false, createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'Want to play', userId: 1, removable: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Currently Playing', userId: 1, removable: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Played', userId: 1, removable: false, createdAt: new Date(), updatedAt: new Date() }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkDelete('Gameshelves', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};
