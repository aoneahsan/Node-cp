const Product = require('./../../models/product');
const Order = require('./../../models/order');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            return res.render('ejs-templates/shop/index', {
                prods: products,
                pageTitle: "Shop Page",
                path: '/shop',
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error')
            });
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while fetching products.";
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            return res.render('ejs-templates/shop/product-list', {
                prods: products,
                pageTitle: "Products List",
                path: '/product-list',
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error')
            });
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while fetching products.";
            return next(error);
        });
};

exports.getProductDetail = (req, res, next) => {
    let id = req.params.productID;
    Product.findById(id)
        .then(product => {
            res.render('ejs-templates/shop/product-detail', {
                product: product,
                pageTitle: "Product Detail",
                path: '/product-detail',
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error')
            });
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while fetching product details.";
            return next(error);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .execPopulate()
        .then(user => {
            let products = [];
            let cartTotalPrice = 0;
            if (user.cart.items.length > 0) {
                products = user.cart.items.map(el => {
                    let product = {
                        id: el.productID._id,
                        title: el.productID.title,
                        description: el.productID.description,
                        price: el.productID.price,
                        image: el.productID.image,
                        userID: el.productID.userID,
                        quantity: el.quantity
                    };
                    cartTotalPrice = cartTotalPrice + (+el.productID.price * +el.quantity);
                    return product;
                });
            }
            res.render('ejs-templates/shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                cartTotalPrice: cartTotalPrice,
                cartProducts: products,
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error')
            });
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while fetching cart items.";
            return next(error);
        });
};

exports.postCart = (req, res, next) => {
    let prodID = req.body.productID;
    req.user.addToCart(prodID)
        .then(result => {
            if (result) {
                return res.redirect('/cart');
            }
            else {
                req.flash('error', "Error Occured!");
                return res.redirect('/404');
            }
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while adding product in cart.";
            return next(error);
        });
};

exports.removeCartItem = (req, res, next) => {
    const prodID = req.body.productID;
    req.user.removeFromCart(prodID)
        .then(result => {
            if (result) {
                return res.redirect('/cart');
            } else {
                req.flash('error', "Error Occured!");
                return res.status(400).redirect('/404');
            }
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while removing product from cart.";
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    // console.log("Checkout Page Get Route: ",req.session);
    res.render('ejs-templates/shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
};

exports.getOrders = (req, res, next) => {
    let userID = null;
    if (req.session.user) {
        userID = req.session.user._id;
    }
    // console.log(userID);
    Order.find({ 'user.id': userID })
        .then(orders => {
            return res.render('ejs-templates/shop/orders', {
                pageTitle: "Orders",
                path: '/orders',
                orders: orders,
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error')
            });
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while fetching user orders.";
            return next(error);
        })
};

exports.placeOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productID')
        .execPopulate()
        .then(user => {
            console.log(user);
            let products = [];
            let cartTotalPrice = 0;
            let userData = {
                id: user._id,
                name: user.name,
                email: user.email
            };
            if (user.cart.items.length > 0) {
                products = user.cart.items.map(el => {
                    let product = {
                        id: el.productID._id,
                        title: el.productID.title,
                        description: el.productID.description,
                        price: el.productID.price,
                        image: el.productID.image,
                        userID: el.productID.userID,
                        quantity: el.quantity
                    };
                    cartTotalPrice = cartTotalPrice + (+el.productID.price * +el.quantity);
                    return product;
                });
            }
            const order = new Order({ products: products, orderTotalPrice: cartTotalPrice, user: userData });
            return order.save();
        })
        .then(orderPlaced => {
            return req.user.clearCart();
        })
        .then(result => {
            if (!result) {
                req.flash('error', "Error Occured!");
                return res.status(400).redirect('/');
            }
            return res.status(200).redirect('/orders');
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while placing user order.";
            return next(error);
        });
};