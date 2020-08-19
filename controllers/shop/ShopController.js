const ProductModel = require('../../models/ProductModel');
const CartModel = require('./../../models/CartModel');

exports.getIndex = (req, res, next) => {
    ProductModel.fetchProducts(products => {
        res.render('ejs-templates/shop/index', {
            prods: products,
            pageTitle: "Shop Page",
            path: '/shop'
        })
    });
};

exports.getProducts = (req, res, next) => {
    ProductModel.fetchProducts(products => {
        res.render('ejs-templates/shop/product-list', {
            prods: products,
            pageTitle: "Products List",
            path: '/product-list'
        })
    });
};

exports.getProductDetail = (req, res, next) => {
    let id = req.params.productID;
    ProductModel.getProduct(id, _product => {
        if (!_product) {
            res.status(404).redirect('/404');
        } else {
            res.render('ejs-templates/shop/product-detail', {
                product: _product,
                pageTitle: "Product Detail",
                path: '/product-detail'
            });
        }
    });
};

exports.getOrders = (req, res, next) => {
    res.render('ejs-templates/shop/orders', {
        pageTitle: "Orders",
        path: '/orders'
    });
};

exports.getCart = (req, res, next) => {
    CartModel.getCart((cartData) => {
        ProductModel.fetchProducts(products => {
            const _cartProducts = [];
            for(product of products) {
                const _cartProd = cartData.products.find(el => el.id == product.id);
                if (_cartProd) {
                    _cartProducts.push({product: product, qty: _cartProd.qty});
                }
            }
            res.render('ejs-templates/shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                cartTotalPrice: cartData.totalPrice,
                cartProducts: _cartProducts
            });
        })
        // ProductModel.getProducts(products => {
        //     let cartProducts = [];
        //     // cartProducts = products.findIndex(el => el.id == )
        // })
    });
};

exports.postCart = (req, res, next) => {
    let id= req.body.productID;
    let price= req.body.productPrice;
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