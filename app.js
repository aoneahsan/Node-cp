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
// defining defualt template engine
expressApp.set('view engine', 'ejs');
expressApp.set('views', 'views');

// **********************************************************************************
// this first middleware is from body-parser package it is used to parse all form data automatically
expressApp.use(bodyParser.urlencoded({ extended: false })); // this will make all simple form fields available in req.body

// **********************************************************************************
// Adding app routes
expressApp.use('/admin',adminRoutes);
expressApp.use(shopRoutes);
expressApp.use(systemController.getPageNotFound);

// **********************************************************************************
// starting server
expressApp.listen(3000);