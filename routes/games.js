const express = require('express');
const router = express.Router();
const { asyncHandler,  } = require('../utils');
const { Game, Gameshelf, Genre, Review, User } = require("../db/models");

router.get('/', asyncHandler(async(req, res, ) => {
  const games = await Game.findAll({
    include: Genre,
    order: [['name', 'ASC']]
  });

  console.log(games[0].Genre.name)
  const genres = await Genre.findAll({
    order: [['name', 'ASC']]
  });
  
  res.render("games", { games, genres, title: "Good Gamez - Gamez" })
}));

router.get('/:id(\\d+)', asyncHandler(async(req,res) => {
  const game = await Game.findOne({
    where: {
      id: req.params.id
    },
    include: Genre
    //include: Review
  })
  
  const reviews = await Review.findAll({
    where: {
      gameId: req.params.id
    },
    include: User
  })

  const userReview = await Review.findOne({
    where: {
      gameId: req.params.id,
      userId: res.locals.user.id
    }
  })

  const genres = await Genre.findAll({
    order: [['name', 'ASC']]
  });

  let sum = 0
  reviews.forEach(review => sum += review.reviewScore)
  const averageReviewScore = sum/reviews.length
  res.render("game", { userReview, averageReviewScore, game, reviews, genres, title:`Good Gamez - ${game.name}` } )
}))

module.exports = router
