const express = require('express');
const { check, body } = require('express-validator');

const User = require('./../models/user');

const authController = require('./../controllers/auth/AuthController');

const authMiddleware = require('./../middlewares/auth/auth');
const unauthMiddleware = require('./../middlewares/unauth/unauth');

const router = express.Router();

router.get('/login', unauthMiddleware, authController.getLogin);

router.post(
    '/login',
    [
        check('email', "Please Enter Correct Email").isEmail(),
        body('password', 'Password should contain only letters and numbers and at least 5 charactors.')
            .isLength({ min: 5 })
            .isAlphanumeric()
    ],
    unauthMiddleware,
    authController.postLogin
);

router.get('/register', unauthMiddleware, authController.getRegister);

router.post(
    '/register',
    [
        check('name', "Please User Name is Required").isString().trim().isLength({ min: 0 }),
        check('email', "Please Enter Correct Email")
            .isEmail()
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            // throw new Error("User Already Exists!");
                            return Promise.reject("User Already Exists!");
                        }
                        else {
                            return true;
                        }
                    })
            }),
        body('password', 'Password should contain only letters and numbers and at least 5 charactors.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
        ,
        body('password_confirm')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password should Match!");
                }
                return true;
            })
    ],
    unauthMiddleware,
    authController.postRegister
);

router.post('/logout', authMiddleware, authController.postLogout);

router.get('/reset', unauthMiddleware, authController.getResetPassword);

router.post('/reset', unauthMiddleware, authController.postResetPassword);

router.get('/reset/:token', unauthMiddleware, authController.getNewPassword);

router.post('/reset/:token', unauthMiddleware, authController.postNewPassword);

module.exports = router;