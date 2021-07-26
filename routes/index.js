var express = require('express');
var router = express.Router();
const { asyncHandler, csrfProtection, handleValidationErrors}  = require("../utils")
const { User } = require("../db/models");
const { check } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'a/A Express Skeleton Home' });
});

router.get('/signup', csrfProtection, (req,res) => {
  res.render('sign-up', { csrfToken: req.csrfToken() })
})

const signupValidator = [
  check("username")
    .exists({ checkFalsy: true})
    .withMessage("Username is required")
    .isLength( { max: 20 } )
    .withMessage("Username must be shorter than 20 characters"),
  check("email")
    .exists({ checkFalsy: true})
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email"),
  check("password")
    .exists({ checkFalsy: true})
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
router.post('/signup', signupValidator, handleValidationErrors, csrfProtection,  asyncHandler(async(req,res) => {

  const { username, email, password} = req.body
  
  const user = await User.build({ username, email })



  res.render('sign-up')
}))

module.exports = router;
