// Imports
const express = require('express');

const shopController = require('../controllers/shop/ShopController');

// Code
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProducts);

router.get('/product-list/:productID', shopController.getProductDetail);

router.get('/orders', shopController.getOrders);

router.post('/place-order', shopController.placeOrder);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/checkout', shopController.getCheckout);

router.get('/product-list/1', shopController.getProductDetail);

router.post('/cart-remove-item', shopController.removeCartItem);

module.exports = router;