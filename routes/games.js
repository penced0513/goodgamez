const express = require('express');
const router = express.Router();
const { asyncHandler, csrfProtection } = require('../utils');
const { Game, Gameshelf, Genre, Review, User, JoinsGamesAndShelf } = require("../db/models");

router.get('/', asyncHandler(async (req, res,) => {
  const games = await Game.findAll({
    include: Genre,
    order: [['name', 'ASC']]
  });

  const genres = await Genre.findAll({
    order: [['name', 'ASC']]
  });

  res.render("games", { games, genres, title: "Good Gamez - Gamez" })
}));

router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  const game = await Game.findOne({
    where: {
      id: req.params.id
    },
    include: Genre
  });

  const reviews = await Review.findAll({
    where: {
      gameId: req.params.id
    },
    include: User
  });

  let userReview;
  if (res.locals.authenticated) {
    userReview = await Review.findOne({
      where: {
        gameId: req.params.id,
        userId: res.locals.user.id
      }
    });
  }

  const genres = await Genre.findAll({
    order: [['name', 'ASC']]
  });
  let shelves
  if (res.locals.authenticated) {

    shelves = await Gameshelf.findAll({
      where: {
        userId: res.locals.user.id
      }
    })
  }
  let containedShelves = [];
  if (res.locals.authenticated) {
    const shelves = await Gameshelf.findAll({
      include: {
        model: Game,
      },
      order: [['name', 'ASC']],
      where: { userId: res.locals.user.id },
    })

    shelves.forEach(shelf => {
      const games = shelf.Games
      const game = games.filter(game => game.id == req.params.id)
      console.log(game)
      if (game.length) {
        console.log(shelf.name)
        containedShelves.push(shelf)
      }
    })
  }


  let sum = 0
  let averageReviewScore = "Leave the first review!"
  if (reviews.length) {
    reviews.forEach(review => sum += review.reviewScore)
    averageReviewScore = (sum / reviews.length).toFixed(1)
  }
  res.render("game", { userReview, averageReviewScore, game, reviews, genres, shelves, containedShelves, csrfToken: req.csrfToken(), title: `Good Gamez - ${game.name}` })
}));

router.get(`/:id(\\d+)/reviews`, asyncHandler(async (req, res) => {

  const gameId = req.params.id
  const reviews = await Review.findAll({
    where: {
      gameId
    },
    include: User
  })
  res.json({ reviews })
}))

router.post(`/:id(\\d+)/review`, asyncHandler(async (req, res) => {
  const { userId, gameId, review, reviewScore } = req.body

  await Review.create({ userId, gameId, review, reviewScore })

  const user = await User.findByPk(userId)
  res.json({ username: user.username })
}))

router.put(`/:id(\\d+)/review`, asyncHandler(async (req, res) => {
  const { userId, gameId, review, reviewScore } = req.body

  const oldReview = await Review.findOne({
    where: {
      userId, gameId
    }
  })
  await oldReview.update({ userId, gameId, review, reviewScore })

  const user = await User.findByPk(userId)
  res.json({ username: user.username })
}))

router.delete(`/:id(\\d+)/review`, asyncHandler(async (req, res) => {
  const { userId, gameId } = req.body

  const oldReview = await Review.findOne({
    where: {
      userId, gameId
    }
  })
  await oldReview.destroy()

  res.json({ message: "Success" })
}))

module.exports = router
