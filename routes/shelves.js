const express = require('express');
const router = express.Router();
const { asyncHandler, csrfProtection, handleValidationErrors } = require("../utils")
const { User, Gameshelf } = require("../db/models");

router.get('/', csrfProtection, asyncHandler(async (req, res, next) => {
    if (req.session.auth) {
        const userId = req.session.auth.userId
        const shelfList = await Gameshelf.findAll({
            where: {
                userId
            }
        })
        res.render('shelves', { title: 'My Shelves', csrfToken: req.csrfToken(), shelfList });
    }
}));

router.post('/', csrfProtection, asyncHandler(async (req, res) => {
    const { newShelf } = req.body
    let shelf = await Gameshelf.create({
        name: newShelf,
        userId: req.session.auth.userId
    })
    res.redirect('/shelves')
}))

module.exports = router;
