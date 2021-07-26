'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gameshelf = sequelize.define('Gameshelf', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Gameshelf.associate = function(models) {
    Gameshelf.belongsTo(models.User, { foreignKey: "userId" } )
    const columnMapping = {
      through: "Joinsgamesandshelf",
      foreignKey: "shelfId",
      otherKey: "gameId"
    }
    Gameshelf.belongsToMany(models.Game, columnMapping)
  };
  return Gameshelf;
};
