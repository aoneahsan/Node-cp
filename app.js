// Constants
const MONGODB_URI = 'mongodb+srv://node_course_DB_user:node_course_DB_user@nodecourseprojectdb.sd1jx.mongodb.net/NodeCourseProjectDB';

// *****************************************
// All Imports Starts
// *****************************************
// Core Imports

// Packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
const flash = require('connect-flash');

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

// adding user session object middleware
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
expressApp.use(session({
    secret: "this is my secret, should be unique and long.",
    resave: false,
    store: store,
    saveUninitialized: false
}));
// expressApp.use(csrf()); // not working
expressApp.use(flash());
// **********************************************************************************
// adding default user in global request so it can be retrived from anywhere in the app
expressApp.use((req, res, next) => {
    User.findById(req.session.user).then(user => {
        if (user) {
            // console.log("session user found and set done");
            req.user = user;
            res.locals.isLoggedIn = req.session.isLoggedIn;
            res.locals.csrfTokken = "req.csrfToken()";
            next();
        }
        else {
            res.locals.isLoggedIn = req.session.isLoggedIn;
            // console.log("session user found and set done");
            res.locals.csrfTokken = "req.csrfToken()";
            return next();
        }
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
mongoose.connect(MONGODB_URI
    , {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        console.log("mongoDB Connected with mongoose!");
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
