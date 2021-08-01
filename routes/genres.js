const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils');
const { Game, Gameshelf, Genre, Review, User } = require("../db/models");

router.get('/:id(\\d+)', asyncHandler(async(req, res) => {
  const genres = await Genre.findAll({
    order: [['name', 'ASC']]
  })
  const genre = await Genre.findByPk(req.params.id)
  const games = await Game.findAll({
    where: {
      genreId: req.params.id
    },
    include: Genre,
    order: [['name', 'ASC']]
  })

  res.render("games", { games, genres, title: `Good Gamez - ${genre.name}` })
}))

module.exports = router