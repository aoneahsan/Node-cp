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

// seqeulizeDB import
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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
    User.findByPk(1).then(user => {
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
expressApp.use(systemController.getPageNotFound);

// **********************************************************************************
// defining sequelize models relations

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelet: "CASCADE" });
User.hasOne(Cart);
Cart.belongsTo(User); // put cascade relation here 
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: "Ahsan", email: 'test@test.com', password: "123456", profile_image: 'ok' });
        } else {
            return user;
        }
    })
    .then(user => {
        const cart = user.createCart();
        return cart;
    })
    .then(cart => {
        // starting server
        expressApp.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });