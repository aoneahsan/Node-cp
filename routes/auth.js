const express = require('express');

const authController = require('./../controllers/auth/AuthController');

const authMiddleware = require('./../middlewares/auth/auth');
const unauthMiddleware = require('./../middlewares/unauth/unauth');

const router = express.Router();

router.get('/login', unauthMiddleware, authController.getLogin);

router.post('/login', unauthMiddleware, authController.postLogin);

router.get('/register', unauthMiddleware, authController.getRegister);

router.post('/register', unauthMiddleware, authController.postRegister);

router.post('/logout', authMiddleware, authController.postLogout);

router.get('/reset', unauthMiddleware, authController.getResetPassword);

router.post('/reset', unauthMiddleware, authController.postResetPassword);

router.get('/reset/:token', unauthMiddleware, authController.getNewPassword);

router.post('/reset/:token', unauthMiddleware, authController.postNewPassword);

module.exports = router;