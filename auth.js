
function loginUser (req, user) {
    req.session.auth = { userId: user.id }
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

function logoutUser () {
    delete req.session.auth
}

module.exports = { loginUser, restoreUser, logoutUser }
