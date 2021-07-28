const express = require('express');
const router = express.Router();
const { asyncHandler, csrfProtection, handleValidationErrors } = require("../utils");
const { User, Gameshelf, JoinsGamesAndShelf } = require("../db/models");

router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
    if (req.session.auth) {
        const userId = req.session.auth.userId
        const shelfList = await Gameshelf.findAll({
            where: {
                userId
            }
        })
        const mainShelf = await Gameshelf.findOne({
            where: {
                userId,
                name: "All"
            }
        })
        const deleteList = await Gameshelf.findAll({
            where: {
                userId,
                removable: true
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList, mainShelf, deleteList });
    }
}));

router.post('/', csrfProtection, asyncHandler(async (req, res) => {
    const { newShelf } = req.body
    let shelf = await Gameshelf.create({
        name: newShelf,
        userId: req.session.auth.userId,
        removable: true
    })
    res.redirect('/shelves')
}));

router.post('/add', csrfProtection, asyncHandler(async (req, res) => {
    const { shelfId, gameId } = req.body
    // console.log(shelfId, gameId)
    await JoinsGamesAndShelf.create({ shelfId, gameId})
    res.redirect(`/games/${gameId}`)
}));

router.get('/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const id = req.params.id
        const userId = req.session.auth.userId
        const shelfList = await Gameshelf.findAll({
            where: {
                userId
            }
        })

        const deleteList = await Gameshelf.findAll({
            where: {
                userId,
                removable: true
            }
        })

        const mainShelf = await Gameshelf.findOne({
            where: {
                userId,
                id
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList, mainShelf, deleteList });
    }
}))

module.exports = router;
