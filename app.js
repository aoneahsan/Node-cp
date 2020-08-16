// *****************************************
// All Imports Starts
// *****************************************
// Core Imports

// Packages
const express = require('express');
const bodyParser = require('body-parser');

// Custom Imports
// const _routes = require('./routes'); // before using Express core node

// *****************************************
// All Imports Ends
// *****************************************
// **********************************************************************************
// *****************************************
// Custom Code Start
// *****************************************

const expressApp = express();

// this first middleware is from body-parser package it is used to parse all form data automatically
expressApp.use(bodyParser.urlencoded({ extended: false })); // this will make all simple form fields available in req.body

expressApp.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="post"> <input type="text" name="message" required> <button type="submit"> Add Product </button> </form>');
});

expressApp.use('/product', (req, res, next) => {
    let result = "You Entered: " + req.body.message;
    res.send(result);
});

expressApp.use('/', (req, res, next) => {
    res.send("<h1>Hello from ExpressJS.</h1>");
});

expressApp.listen(3000);