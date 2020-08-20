const Product = require('./../../models/product');
const User = require('./../../models/user');

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(products => {
        // console.log(products);
        return res.render('ejs-templates/shop/index', {
            prods: products,
            pageTitle: "Shop Page",
            path: '/shop'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        console.log(products);
        return res.render('ejs-templates/shop/product-list', {
            prods: products,
            pageTitle: "Products List",
            path: '/product-list'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProductDetail = (req, res, next) => {
    let id = req.params.productID;
    console.log("i am in.", id);
    Product.findByPk(id).then(product => {
        // console.log(product);
        res.render('ejs-templates/shop/product-detail', {
            product: product,
            pageTitle: "Product Detail",
            path: '/product-detail'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            res.render('ejs-templates/shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                cartTotalPrice: cart.totalPrice,
                cartProducts: cart.products
            });
        })
        .catch(err => {
            console.log(err);
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
                return res.redirect('/404');
            }
        })
        .catch(err => console.log(err));
};

exports.removeCartItem = (req, res, next) => {
    const prodID = req.body.productID;
    let userCart;
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
    res.render('ejs-templates/shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout'
    });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            return res.render('ejs-templates/shop/orders', {
                pageTitle: "Orders",
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.placeOrder = (req, res, next) => {
    req.user.placeOrder()
        .then(result => {
            if (!result) {
                return res.status(400).redirect('/');
            }
            return res.status(200).redirect('/orders');
        })
        .catch(err => console.log(err));
};