const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('./../../models/product');
const Order = require('./../../models/order');

const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
    let pageNo = +req.query.page || 1;
    let totalItems;
    Product.find().count()
        .then(prodsCount => {
            totalItems = prodsCount;
            return Product.find()
                .skip((pageNo - 1) * ITEMS_PER_PAGE)  // let's say on page two then,  2-1 = 1 => 1*2 = 2  || so this will skip first two items 
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            return res.render('ejs-templates/shop/index', {
                prods: products,
                pageTitle: "Shop Page",
                path: '/shop',
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error'),
                pageNo: pageNo,
                totalItems: totalItems,
                hasNextPage: (ITEMS_PER_PAGE * pageNo) < totalItems,
                hasPreviousPage: pageNo > 1,
                nextPage: pageNo + 1,
                previousPage: pageNo - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
    let pageNo = +req.query.page || 1;
    let totalItems;
    Product.find().count()
        .then(prodsCount => {
            totalItems = prodsCount;
            return Product.find()
                .skip((pageNo - 1) * ITEMS_PER_PAGE)  // let's say on page two then,  2-1 = 1 => 1*2 = 2  || so this will skip first two items 
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            return res.render('ejs-templates/shop/product-list', {
                prods: products,
                pageTitle: "Products List",
                path: '/product-list',
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error'),
                pageNo: pageNo,
                totalItems: totalItems,
                hasNextPage: (ITEMS_PER_PAGE * pageNo) < totalItems,
                hasPreviousPage: pageNo > 1,
                nextPage: pageNo + 1,
                previousPage: pageNo - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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

exports.getInvoice = (req, res, next) => {
    const orderID = req.params.orderID;
    const invoiceName = "invoice-" + orderID + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    Order.findById(orderID)
        .then(order => {
            if (!order) {
                return next(new Error("No Order Found!"));
            }
            else if (order.user.id.toString() !== req.user._id.toString()) {
                return next(new Error("Not Autherized"));
            }
            else {
                fs.readFile(invoicePath, (err, fileContent) => {
                    if (err) {
                        return next(err);
                    }
                    else {
                        const pdfDoc = new PDFDocument();
                        // setting headers
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
                        // writing file on server
                        pdfDoc.pipe(fs.createWriteStream(invoiceName));
                        // sending file back in response
                        pdfDoc.pipe(res);
                        // writing file it does not metter if you wirte above two line before or after "pdfDoc.end()" these will only execute after you call "pdfDoc.end()".
                        pdfDoc.fontSize(24).text(`Order # ${orderID}`);
                        pdfDoc.fontSize(18).text(`No of Products: ${order.products.length}`);
                        pdfDoc.fontSize(16).text("#---------------------------------------------#");
                        pdfDoc.fontSize(16).text(`Products List:`);
                        let orderTotalPrice = 0;
                        order.products.forEach((prod, index) => {
                            orderTotalPrice += +prod.price * +prod.quantity;
                            pdfDoc.text(`#${index + 1}  -  Product Title: ${prod.title}  -  Product Qnatity: ${prod.quantity}  -  Product Price: ${prod.price}`);
                        });
                        pdfDoc.fontSize(16).text("#---------------------------------------------#");
                        pdfDoc.fontSize(22).text("Order Total Price: $" + orderTotalPrice);
                        pdfDoc.end();
                    }
                })
            }
        })
        .catch(err => next(err));
}