'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkInsert('Games', [
      { name: 'Tribes of Midgard', description: 'Heads up, the Giants are coming! Mythical creatures, deadly spirits, and gigantic brutes threaten to bring on Ragnarök—the end of the world. Form your tribe of up to 10 and become Viking legends in this action-survival RPG of gigantic proportions.', img: "https://cdn.akamai.steamstatic.com/steam/apps/858820/header.jpg?t=1626716349", developer: 'Norsfell', genreId: 9, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Stardew Valley', description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?"
        , img: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg?t=1608624324", developer:
          "ConcernedApe", genreId: 12, createdAt: new Date(), updatedAt: new Date()
      },
      { name: 'RimWorld', description: 'A sci-fi colony sim driven by an intelligent AI storyteller. Generates stories by simulating psychology, ecology, gunplay, melee combat, climate, biomes, diplomacy, interpersonal relationships, art, medicine, trade, and more.', img: 'https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg?t=1626913006', developer: 'Ludeon Studios', genreId: 12, createdAt: new Date(), updatedAt: new Date() },
      { name: 'It Takes Two', description: 'Embark on the craziest journey of your life in It Takes Two. Invite a friend to join for free with Friend’s Pass and work together across a huge variety of gleefully disruptive gameplay challenges.', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1426210/header_alt_assets_0.jpg?t=1625770916', developer: 'Hazelight', genreId: 7, createdAt: new Date(), updatedAt: new Date() },
      { name: 'GUILTY GEAR STRIVE', description: 'The cutting-edge 2D/3D hybrid graphics pioneered in the Guilty Gear series have been raised to the next level in “GUILTY GEAR -STRIVE-“. The new artistic direction and improved character animations will go beyond anything you’ve seen before in a fighting game!', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1384160/header.jpg?t=1625015685', developer: 'Arc System Works', genreId: 13, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Red Dead Redemption 2', description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online.', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg?t=1618851907', developer: 'Rockstar Games', genreId: 9, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Orcs Must Die! 3', description: 'Slice, burn, toss, zap, grind and gib massive hordes of repugnant orcs in this long-awaited successor to the award-winning Orcs Must Die! series.', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1522820/header.jpg?t=1627049071', developer: 'Robot Entertainment', genreId: 3, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Games', null, { truncate: true, cascade: true, restartIdentity: true });
  }
};
