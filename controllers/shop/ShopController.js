const Product = require('./../../models/product');
const Order = require('./../../models/order');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            // console.log(products);
            return res.render('ejs-templates/shop/index', {
                prods: products,
                pageTitle: "Shop Page",
                path: '/shop',
                isLoggedIn: req.session.isLoggedIn
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            // console.log(products);
            return res.render('ejs-templates/shop/product-list', {
                prods: products,
                pageTitle: "Products List",
                path: '/product-list',
                isLoggedIn: req.session.isLoggedIn
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getProductDetail = (req, res, next) => {
    let id = req.params.productID;
    // console.log("i am in.", id);
    Product.findById(id)
        .then(product => {
            // console.log(product);
            res.render('ejs-templates/shop/product-detail', {
                product: product,
                pageTitle: "Product Detail",
                path: '/product-detail',
                isLoggedIn: req.session.isLoggedIn
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
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
                isLoggedIn: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    let prodID = req.body.productID;
    req.user.addToCart(prodID)
        .then(result => {
            if (result) {
                return res.redirect('/cart');
            }
            else {
                return res.redirect('/404');
            }
        })
        .catch(err => console.log(err));
};

exports.removeCartItem = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    const prodID = req.body.productID;
    req.user.removeFromCart(prodID)
        .then(result => {
            if (result) {
                return res.redirect('/cart');
            } else {
                return res.status(400).redirect('/404');
            }
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    // console.log("Checkout Page Get Route: ",req.session);
    res.render('ejs-templates/shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout',
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.getOrders = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
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
                isLoggedIn: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.placeOrder = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
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
            const order = new Order({products: products, orderTotalPrice: cartTotalPrice, user: userData});
            return order.save();
        })
        .then(orderPlaced => {
            return req.user.clearCart();
        })
        .then(result => {
            if (!result) {
                return res.status(400).redirect('/');
            }
            return res.status(200).redirect('/orders');
        })
        .catch(err => console.log(err));
};