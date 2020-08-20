// Imports
const express = require('express');

const shopController = require('../controllers/shop/ShopController');

// Code
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProducts);

router.get('/product-list/:productID', shopController.getProductDetail);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-remove-item', shopController.removeCartItem);

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

router.post('/place-order', shopController.placeOrder);

module.exports = router;