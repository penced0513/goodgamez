'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gameshelf = sequelize.define('Gameshelf', {
    name: DataTypes.STRING,
    removable: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {});
  Gameshelf.associate = function (models) {
    Gameshelf.belongsTo(models.User, { foreignKey: "userId" })
    const columnMapping = {
      through: "JoinsGamesAndShelf",
      foreignKey: "shelfId",
      otherKey: "gameId"
    }
    Gameshelf.belongsToMany(models.Game, columnMapping)
  };
  return Gameshelf;
};
