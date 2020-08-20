const Product = require('../../models/product');

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
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
    Product.findAll().then(products => {
        // console.log(result);
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

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
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
    let newlyPlacedOrder;
    let userCart;
    let cartProducts;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return userCart.getProducts();
        })
        .then(products => {
            if (products.length < 1) {
                return res.status(400).redirect('/');
            }
            cartProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            newlyPlacedOrder = order;
            return newlyPlacedOrder.addProducts(cartProducts.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }))
        })
        .then(orderPlaced => {
            if (!orderPlaced) {
                return res.status(400).redirect('/');
            }
            return userCart.setProducts(null);
        })
        .then(result => {
            if (!result) {
                return res.status(400).redirect('/');
            }
            return res.status(200).redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            res.render('ejs-templates/shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                cartTotalPrice: 0,
                cartProducts: products
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    let prodID = req.body.productID;
    let userCart;
    req.user.getCart().then(cart => {
        userCart = cart;
        return cart.getProducts({ where: { id: prodID } });
    })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQuantity = 1;
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return userCart.addProduct(product, { through: { quantity: newQuantity } });
            }
            return Product.findByPk(prodID)
                .then(product => {
                    return userCart.addProduct(product, { through: { quantity: newQuantity } });
                }).catch(err => console.log(err));
        })
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

exports.getCheckout = (req, res, next) => {
    res.render('ejs-templates/shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout'
    });
};

exports.removeCartItem = (req, res, next) => {
    const prodID = req.body.productID;
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({ where: { id: prodID } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            else {
                return res.status(400).redirect('/404');
            }
            return userCart.removeProduct(product);
        })
        .then(result => {
            if (result) {
                return res.redirect('/cart');
            } else {
                return res.status(400).redirect('/404');
            }
        })
        .catch(err => console.log(err));
};