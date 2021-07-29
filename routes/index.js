const express = require('express');
const router = express.Router();
const { asyncHandler, csrfProtection, handleValidationErrors } = require("../utils")
const { User, Gameshelf } = require("../db/models");

const { check } = require('express-validator');
const bcrypt = require("bcryptjs");
const { loginUser, logoutUser } = require("../auth");
const { validationResult } = require("express-validator");

/* GET home page. */
router.get('/', function (req, res, next) {
  if (res.locals.authenticated) {
    res.redirect("/shelves")
  } else {
    res.redirect("/games")
  }
});

router.get('/login', csrfProtection, (req, res) => {
  res.render('login', { title: "Good Gamez - Log In", csrfToken: req.csrfToken() })
});

router.post('/login', csrfProtection, asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const errors = [];
  const user = await User.findOne({
    where: { username }
  });

  if (user) {
    const isPassword = await bcrypt.compare(password, user.hashedPassword)
    if (isPassword) {
      loginUser(req, res, user);
      return res.redirect("/")
    }
  }

  errors.push("Invalid Login")

  res.render("login", { username, errors, title: "Good Gamez - Log In", csrfToken: req.csrfToken() })

}));

router.get('/logout', asyncHandler(async (req, res) => {
  await logoutUser(req, res);
  // req.session = null;
  // res.send("logged out")
  req.session.save(()=> res.redirect('/'))
}));

router.get('/signup', csrfProtection, (req, res) => {
  res.render('sign-up', { title: "Good Gamez - Sign up", csrfToken: req.csrfToken() })
});

const signupValidator = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .isLength({ max: 20 })
    .withMessage("Username must be shorter than 20 characters"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/(.*[a-z])/)
    .withMessage("Must contain a lowercase letter")
    .matches(/(.*[A-Z])/)
    .withMessage("Must contain an uppercase letter")
    .matches(/(.*[0-9])/)
    .withMessage("Must contain a number")
    .matches(/(.*[!@#$%^&*])/)
    .withMessage("Must contain a special character(!@#$%^&*)"),
  check("confirmedPassword")
    .custom((confirmedPassword, { req }) => {
      if (confirmedPassword !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
]
router.post('/signup', signupValidator, csrfProtection, asyncHandler(async (req, res) => {

  const { username, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 12)

  const validationErrors = validationResult(req).errors.map(({ msg }) => `${msg}`);

  if (!validationErrors.length) {
    const user1 = await User.findOne({
      where: {
        username
      }
    })

    const user2 = await User.findOne({
      where: {
        email
      }
    })

    const errors = []

    if (user1) {
      errors.push("Username is taken")
    }

    if (user2) {
      errors.push("Email is taken")
    }

    if (!user1 && !user2) {
      const user = await User.create({ username, email, hashedPassword })
      await Gameshelf.create({ name: 'All', userId: user.id, removable: false })
      await Gameshelf.create({ name: 'Want to play', userId: user.id, removable: false })
      await Gameshelf.create({ name: 'Currently Playing', userId: user.id, removable: false })
      await Gameshelf.create({ name: 'Played', userId: user.id, removable: false })
      loginUser(req, res, user)
      res.redirect('/')
    } else {

      res.render('sign-up', { title: "Good Gamez - Sign Up", csrfToken: req.csrfToken(), validationErrors: errors, username, email })
    }

  } else {
    res.render('sign-up', { title: "Good Gamez - Sign Up", csrfToken: req.csrfToken(), validationErrors, username, email })
    }

}))

router.get('/demo', asyncHandler(async(req, res) => {
  const user = await User.findByPk(1)

  loginUser(req, res, user)

  // res.locals.user = user
  // res.locals.authenticated = true
  
  req.session.save(() => res.redirect('/'))
}))

module.exports = router;
