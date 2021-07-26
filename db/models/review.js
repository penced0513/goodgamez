'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    review: DataTypes.TEXT,
    reviewScore: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER
  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.Game, { foreignKey: "gameId" } )
    Review.belongsTo(models.User, { foreignKey: "userId" } )
  };
  return Review;
};
