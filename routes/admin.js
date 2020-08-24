// Imports
const express = require('express');
const { body } = require('express-validator');

const adminController = require('./../controllers/admin/AdminController');

const authMiddleware = require('./../middlewares/auth/auth');

// Code
const router = express.Router();

router.get('/products', authMiddleware, adminController.getProducts);

router.get('/add-product', authMiddleware, adminController.getAddProductPage);

router.post(
    '/add-product',
    [
        body('title', 'Product title should be only letters and numbers and at least 5 charactors.')
            .trim()
            .isLength({ min: 5 })
            .isAlphanumeric()
        ,
        body('image', 'Product image should be online image URL only.')
            .trim()
            .isURL()
        ,
        body('price', 'Product title should be only numbers.')
            .trim()
            .isNumeric({ min: 0 })
        ,
        body('description', 'Product description should at least 20 charactors long.')
            .trim()
            .isLength({ min: 20 })
    ],
    authMiddleware,
    adminController.postStoreProduct
);

router.get('/edit-product/:productID', authMiddleware, adminController.getEditProductPage);

router.post(
    '/edit-product',
    [
        body('title', 'Product title should be only letters and numbers and at least 5 charactors.')
            .trim()
            .isLength({ min: 5 })
            .isAlphanumeric()
        ,
        body('image', 'Product image should be online image URL only.')
            .trim()
            .isURL()
        ,
        body('price', 'Product title should be only numbers.')
            .trim()
            .isNumeric({ min: 0 })
        ,
        body('description', 'Product description should at least 20 charactors long.')
            .trim()
            .isLength({ min: 20 })
    ],
    authMiddleware,
    adminController.postUpdateProduct
);

router.post('/delete-product', authMiddleware, adminController.deleteProduct);

module.exports = router;