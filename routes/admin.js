// Imports
const express = require('express');

const adminController = require('./../controllers/admin/AdminController');

// Code
const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/add-product', adminController.getAddProductPage);

router.post('/add-product', adminController.postStoreProduct);

router.get('/edit-product/:productID', adminController.getEditProductPage);

router.post('/edit-product', adminController.postUpdateProduct);

router.post('/delete-product', adminController.deleteProduct);

module.exports = router;