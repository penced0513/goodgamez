const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true})

const { check, validationResult } = require("express-validator");
const { URITooLong } = require('http-errors');

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => error.msg);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        return next(err);
    }
    next();
};

const asyncHandler = (handler) => (req,res,next) => handler(req,res,next).catch(next)




module.exports = { asyncHandler, csrfProtection, handleValidationErrors}                    