// *****************************************
// All Imports Starts
// *****************************************
// Core Imports

// Packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Custom Imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const systemController = require('./controllers/SystemController');

// Models
const User = require('./models/user');

// MongoDB Import
const mongoDBConnect = require('./utils/database').mongoDBConnect;

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
// expressApp.use(express.static(path.join(__dirname, 'data')));

// **********************************************************************************
// adding default user in global request so it can be retrived from anywhere in the app
expressApp.use((req, res, next) => {
    User.findByPk("5f3e2f9f455bbe91aa73fc21").then(user => {
        req.user = new User(user._id, user.name, user.email, user.cart);
        // console.log(req.user);
        next();
    }).catch(err => {
        console.log(err);
    });
});

// **********************************************************************************
// defining defualt template engine
expressApp.set('view engine', 'ejs');
expressApp.set('views', 'views');

// **********************************************************************************
// this first middleware is from body-parser package it is used to parse all form data automatically
expressApp.use(bodyParser.urlencoded({ extended: false })); // this will make all simple form fields available in req.body

// **********************************************************************************
// Adding app routes
expressApp.use('/admin', adminRoutes);
expressApp.use(shopRoutes);
expressApp.use(systemController.getPageNotFound);

// create user after auth module
mongoDBConnect(() => {
    console.log("mongoDB Connected!");
    // starting server
    expressApp.listen(3000);
})