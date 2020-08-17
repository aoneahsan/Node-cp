// Imports
const express = require('express');
const path = require('path');

// Root Path Import
const rootPath = require('./../utils/root-path');

// Admin Data Import
const adminData = require('./admin');

// Code
const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;
    // res.sendFile(path.join(rootPath, 'views', 'shop.html'));
    // res.render('pug-templates/shop', {
    //     prods: products,
    //     pageTitle: "Shop Page",
    //     path: '/shop'
    // });
    // res.render('handlebars-templates/shop', {
    //     prods: products,
    //     pageTitle: "Shop Page",
    //     path: '/shop',
    //     shopPage: true,
    //     haveProducts: products.length > 0
    // });
    console.log("Shop.js == products = ", products);
    res.render('ejs-templates/shop', {
        prods: products,
        pageTitle: "Shop Page",
        shopPage: true,
        path: '/shop'
    });
});

module.exports = router;