const express = require('express');
const router = express.Router();
const { asyncHandler, csrfProtection, handleValidationErrors } = require("../utils");
const { User, Gameshelf, JoinsGamesAndShelf, Game, Review } = require("../db/models");

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
        const allGameIds = await JoinsGamesAndShelf.findAll({
            where: {
                shelfId: mainShelf.id
            }
        })
        let gameListArray = allGameIds.map(el => {
            return el.gameId
        })
        const findGames = await Game.findAll({
            where: {
                id: gameListArray,
            }
        })
        const findReviews = await Review.findAll({
            where: {
                gameId: gameListArray,
                userId
            }
        })
        let reviewScoreArray = findReviews.map(el => {
            return el.reviewScore
        })
        const deleteList = await Gameshelf.findAll({
            where: {
                userId,
                removable: true
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList, mainShelf, deleteList, findGames, reviewScoreArray });
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
    const userId = res.locals.user.id
    const userAllShelf = await Gameshelf.findOne(
        {
            where: {
                userId,
                name: "All"
            }
        })

    const userAllShelfId = userAllShelf.id

    const isInAll = await JoinsGamesAndShelf.findOne({
        where: {
            shelfId: userAllShelfId,
            gameId
        }
    })

    if (!isInAll) {
        await JoinsGamesAndShelf.create({ shelfId: userAllShelfId, gameId })
    }

    if (shelfId != userAllShelfId) {
        await JoinsGamesAndShelf.create({ shelfId, gameId })
    }
    res.redirect(`/games/${gameId}`)
}));

router.post('/delete', csrfProtection, asyncHandler(async (req, res) => {
    const { shelfId } = req.body
    const shelf = await Gameshelf.findByPk(shelfId)
    const joins = await JoinsGamesAndShelf.findAll({
        where: {
            shelfId
        }
    })
    joins.forEach(el => {
        el.destroy()
    })
    shelf.destroy()
    res.redirect('/shelves')
}))

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
        const allGameIds = await JoinsGamesAndShelf.findAll({
            where: {
                shelfId: mainShelf.id
            }
        })
        let gameListArray = allGameIds.map(el => {
            return el.gameId
        })
        const findGames = await Game.findAll({
            where: {
                id: gameListArray
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList, mainShelf, deleteList, findGames });
    }
}))

router.post('/deleteGame', csrfProtection, asyncHandler(async (req, res) => {
    const { game, mainShelf } = req.body

    let shelf = await Gameshelf.findByPk(mainShelf)
    if (shelf.name !== 'All') {
        let gameDel = await JoinsGamesAndShelf.findAll({
            where: {
                shelfId: mainShelf,
                gameId: game
            }
        })
        gameDel[0].destroy()
    } else {
        let shelfList = await Gameshelf.findAll({
            where: {
                userId: req.session.auth.userId
            }
        })
        let shelfListArray = shelfList.map(el => {
            return el.id
        })
        let deleteFromAll = await JoinsGamesAndShelf.findAll({
            where: {
                shelfId: shelfListArray,
                gameId: game
            }
        })
        deleteFromAll.forEach(el => {
            el.destroy()
        })
    }
    res.redirect(`/shelves/${mainShelf}`)
}))

module.exports = router;
