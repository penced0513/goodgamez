'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    img: DataTypes.TEXT,
    developer: DataTypes.STRING,
    genreId: DataTypes.INTEGER
  }, {});
  Game.associate = function (models) {
    Game.belongsTo(models.Genre, { foreignKey: "genreId" })
    Game.hasMany(models.Review, { foreignKey: "gameId" })
    const columnMapping = {
      through: "Joinsgamesandshelf",
      foreignKey: "gameId",
      otherKey: "shelfId",
    };
    Game.belongsToMany(models.Gameshelf, columnMapping)
  };
  return Game;
};
