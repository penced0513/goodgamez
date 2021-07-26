'use strict';
module.exports = (sequelize, DataTypes) => {
  const JoinsGamesAndShelf = sequelize.define('JoinsGamesAndShelf', {
    gameId: DataTypes.INTEGER,
    shelfId: DataTypes.INTEGER
  }, {});
  JoinsGamesAndShelf.associate = function(models) {
    // associations can be defined here
  };
  return JoinsGamesAndShelf;
};