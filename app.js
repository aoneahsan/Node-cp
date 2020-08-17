// *****************************************
// All Imports Starts
// *****************************************
// Core Imports

// Packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Custom Imports
// const _routes = require('./routes'); // before using Express core node
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// *****************************************
// All Imports Ends
// *****************************************
// **********************************************************************************
// *****************************************
// Custom Code Start
// *****************************************

// **********************************************************************************
// creating express app
const expressApp = express();

// **********************************************************************************
// including static files (style, scripts, images) files.
expressApp.use(express.static(path.join(__dirname, 'public')));

// **********************************************************************************
// defining defualt template engine
// 1 - PUG
// expressApp.set('view engine', 'pug');

// 2 - handlebars
// const expressHBS = require('express-handlebars');
// expressApp.engine('hbs', expressHBS({
//     layoutDir: 'views/layouts/',
//     defualtLayout: 'main',
//     extname: 'hbs'
// }));
// expressApp.set('view engine', 'hbs');

// 3 - eje
expressApp.set('view engine', 'ejs');
expressApp.set('views', 'views');

// **********************************************************************************
// this first middleware is from body-parser package it is used to parse all form data automatically
expressApp.use(bodyParser.urlencoded({ extended: false })); // this will make all simple form fields available in req.body

// **********************************************************************************
// Adding app routes
expressApp.use(adminData.routes);
expressApp.use(shopRoutes);
expressApp.use((req, res, next) => {
    // res.status(404).render('pug-templates/404', {
    //     pageTitle: "404 | Not Found",
    //     path: '/404'
    // });
    // res.status(404).render('handlebars-templates/404', {
    //     pageTitle: "404 | Not Found",
    //     path: '/404'
    // });
    res.status(404).render('ejs-templates/404', {
        pageTitle: "404 | Not Found",
        path: '/404'
    });
});

// **********************************************************************************
// starting server
expressApp.listen(3000);