const express = require('express');
const router = express.Router();
const { asyncHandler,  } = require('../utils');
const { Game, Gameshelf, Genre, Review, User } = require("../db/models");

router.get('/', asyncHandler(async(req, res, ) => {
  const games = await Game.findAll({
    include: Genre,
    order: [['name', 'ASC']]
  });

  const genres = await Genre.findAll({
    order: [['name', 'ASC']]
  });
  
  res.render("games", { games, genres, title: "Good Gamez - Gamez" })
}));

module.exports = router