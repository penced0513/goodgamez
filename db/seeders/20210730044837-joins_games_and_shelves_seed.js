'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkInsert('JoinsGamesAndShelves', [
        { gameId: 7, shelfId: 3, createdAt: new Date(), updatedAt: new Date() },
        { gameId: 7, shelfId: 1, createdAt: new Date(), updatedAt: new Date() },
        { gameId: 31, shelfId: 2, createdAt: new Date(), updatedAt: new Date() },
        { gameId: 31, shelfId: 1, createdAt: new Date(), updatedAt: new Date() },
        { gameId: 20, shelfId: 1, createdAt: new Date(), updatedAt: new Date() },
        { gameId:20, shelfId: 4, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkDelete('JoinsGamesAndShelves', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};
