// Imports
const express = require('express');

const shopController = require('../controllers/shop/ShopController');

// Code
const router = express.Router();

const authMiddleware = require('./../middlewares/auth/auth');
// const unauthMiddleware = require('./../middlewares/unauth/unauth');

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProducts);

router.get('/product-list/:productID', shopController.getProductDetail);

router.get('/cart', authMiddleware, shopController.getCart);

router.post('/cart', authMiddleware, shopController.postCart);

router.post('/cart-remove-item', authMiddleware, shopController.removeCartItem);

router.get('/checkout', authMiddleware, shopController.getCheckout);

router.get('/orders', authMiddleware, shopController.getOrders);

router.post('/place-order', authMiddleware, shopController.placeOrder);

module.exports = router;