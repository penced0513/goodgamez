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
        const deleteList = await Gameshelf.findAll({
            where: {
                userId,
                removable: true
            }
        })
        const moveShelf = shelfList.filter(el => {
            if (el.id !== mainShelf.id) {
                return el
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList, mainShelf, deleteList, findGames, moveShelf });
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

    const findShelfById = Gameshelf.findByPk(shelfId)
    if (!findShelfById.removable) {
        let shelfCompare = await Gameshelf.findAll({
            where: {
                userId: req.session.auth.userId,
                name: ['Want to play', 'Currently Playing', 'Played']
            }
        })
        let shelfFilter = shelfCompare.filter(el => {
            if (el.name !== findShelfById.name) {
                return el.id
            }
        })
        let filteredShelfArr = shelfFilter.map(el => {
            return el.id
        })
        let finalRes = await JoinsGamesAndShelf.findAll({
            where: {
                shelfId: filteredShelfArr,
                gameId
            }
        })
        finalRes.forEach(el => {
            el.destroy()
        })
    }

    if (shelfId !== userAllShelfId) {
        await JoinsGamesAndShelf.create({ shelfId, gameId })
    }
    res.redirect(`/games/${gameId}`)
}));


router.post('/move', csrfProtection, asyncHandler(async (req, res) => {
    const { game, mainShelf, shelfId } = req.body

    const shelfCheck = await Gameshelf.findByPk(shelfId)
    await JoinsGamesAndShelf.create({
        gameId: game,
        shelfId
    })
    const mainCheck = await Gameshelf.findByPk(mainShelf)
    if (mainCheck.name !== 'All' && !mainCheck.removable && !shelfCheck.removable) {
        let joinsId = await JoinsGamesAndShelf.findOne({
            where: {
                shelfId: mainShelf,
                gameId: game
            }
        })
        joinsId.destroy()
    } else {
        if (!shelfCheck.removable) {
            let shelfCompare = await Gameshelf.findAll({
                where: {
                    userId: req.session.auth.userId,
                    name: ['Want to play', 'Currently Playing', 'Played']
                }
            })
            let shelfFilter = shelfCompare.filter(el => {
                if (el.name !== shelfCheck.name) {
                    return el.id
                }
            })
            let filteredShelfArr = shelfFilter.map(el => {
                return el.id
            })
            let finalRes = await JoinsGamesAndShelf.findAll({
                where: {
                    shelfId: filteredShelfArr,
                    gameId: game
                }
            })
            finalRes.forEach(el => {
                el.destroy()
            })
        }
    }
    res.redirect(`/shelves/${mainShelf}`)
}))

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
        const moveShelf = shelfList.filter(el => {
            if (el.id !== mainShelf.id && el.name !== 'All') {
                return el
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList, mainShelf, deleteList, findGames, moveShelf });
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
