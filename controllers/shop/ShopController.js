const ProductModel = require('../../models/ProductModel');
const CartModel = require('./../../models/CartModel');

exports.getIndex = (req, res, next) => {
    ProductModel.fetchProducts().then(result => {
        // console.log(result);
        return res.render('ejs-templates/shop/index', {
            prods: result[0],
            pageTitle: "Shop Page",
            path: '/shop'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    ProductModel.fetchProducts().then(result => {
        // console.log(result);
        const products = result[0];
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
    ProductModel.getProduct(id).then(result => {
        console.log(result[0]);
        const _product = result[0][0];
        res.render('ejs-templates/shop/product-detail', {
            product: _product,
            pageTitle: "Product Detail",
            path: '/product-detail'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
    res.render('ejs-templates/shop/orders', {
        pageTitle: "Orders",
        path: '/orders'
    });
};

exports.getCart = (req, res, next) => {
    CartModel.getCart().then(result => {
        console.log(result);
        res.render('ejs-templates/shop/cart', {
            pageTitle: "Your Cart",
            path: '/cart',
            cartTotalPrice: cartData.totalPrice,
            cartProducts: _cartProducts
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postCart = (req, res, next) => {
    let id = req.body.productID;
    let price = req.body.productPrice;
    CartModel.addProduct(id, price, () => {
        res.status(200).redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('ejs-templates/shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout'
    });
};

exports.removeCartItem = (req, res, next) => {
    const id = req.body.productID;
    CartModel.removeProduct(id, (result) => {
        if (result) {
            return res.status(200).redirect('/cart');
        } else {
            return res.status(404).redirect('/cart');
        }
    })
};