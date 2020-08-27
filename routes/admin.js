// Imports
const express = require('express');

const adminController = require('./../controllers/admin/AdminController');

const authMiddleware = require('./../middlewares/auth/auth');

// Code
const router = express.Router();

router.get('/products', authMiddleware, adminController.getProducts);

router.get('/add-product', authMiddleware, adminController.getAddProductPage);

router.post('/add-product', authMiddleware, adminController.postStoreProduct);

router.get('/edit-product/:productID', authMiddleware, adminController.getEditProductPage);

router.post('/edit-product', authMiddleware, adminController.postUpdateProduct);

router.delete('/product/:productID', authMiddleware, adminController.deleteProduct);

module.exports = router;