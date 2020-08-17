// Imports
const express = require('express');
const path = require('path');

const rootPath = require('./../utils/root-path');


// Code
const router = express.Router();

const prods = [];

router.get('/add-product', (req, res, next) => {
    // res.render('pug-templates/add-product', {
    //     pageTitle: "Add Product",
    //     path: '/add-product'
    // });
    // res.render('handlebars-templates/add-product', {
    //     pageTitle: "Add Product",
    //     path: '/add-product',
    //     addProductPage: true
    // });
    res.render('ejs-templates/add-product', {
        pageTitle: "Add Product",
        path: '/add-product',
        path: '/add-product'
    });
});

router.post('/add-product', (req, res, next) => {
    prods.push(
        {
            title: req.body.title
        }
    );
    res.redirect('/');
});

module.exports.routes = router;
module.exports.products = prods;