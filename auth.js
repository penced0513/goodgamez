const { User } = require("./db/models")

function loginUser (req, user) {
    req.session.auth = { userId: user.id }
}

function logoutUser (req, res) {
    delete req.session.auth;
}

async function restoreUser(req,res,next) {
    if (req.session.auth) {
        const userId = req.session.auth.userId
        const user = await User.findByPk(userId)
        if (user) {
            res.locals.authenticated = true
            res.locals.user = user
        } else {
            res.locals.authenticated = false
        }
    }
    next()
}

module.exports = { loginUser, restoreUser, logoutUser }
