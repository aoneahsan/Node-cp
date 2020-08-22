// *****************************************
// All Imports Starts
// *****************************************
// Core Imports

// Packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Custom Imports
// Routes Files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
// Controller Files
const systemController = require('./controllers/SystemController');
// Models Files
const User = require('./models/user');

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
    User.findById('5f40941a8b8af870f61df2fa').then(user => {
        req.user = user;
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
expressApp.use(authRoutes);
expressApp.use(systemController.getPageNotFound);

// create user after auth module
mongoose.connect('mongodb+srv://node_course_DB_user:node_course_DB_user@nodecourseprojectdb.sd1jx.mongodb.net/', { dbName: 'NodeCourseProjectDB', useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => {
        console.log("mongoDB Connected with mongoose!");
        User.findOne()
            .then(user => {
                // console.log(user);
                if (!user) {
                    User.create({ name: 'Ahsan', email: 'ahsan@demo.com', cart: { items: [] } });
                }
            })
            .catch(err => console.log(err));
        // starting server
        expressApp.listen(3000);
    })
    .catch(err => console.log("error while connecting mongoDB"));


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://node_course_DB_user:node_course_DB_user@nodecourseprojectdb.sd1jx.mongodb.net/NodeCourseProjectDB?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     //   client.close();
// });
// expressApp.listen(3000);
