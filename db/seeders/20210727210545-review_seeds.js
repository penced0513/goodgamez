'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkInsert('Reviews', [
        {
        review: 'Metacritic said this game was good',
        reviewScore: 89,
        userId: 1,
        gameId: 2,
        createdAt: new Date(), 
        updatedAt: new Date()
       }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkDelete('People', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};
