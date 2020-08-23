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

module.exports = router;