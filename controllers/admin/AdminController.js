const Product = require('../../models/product');

const fileHelpers = require('./.././../helpers/file');

exports.getProducts = (req, res, next) => {
    Product.find({ userID: req.user._id })
        .then(products => {
            return res.render('ejs-templates/admin/products', {
                prods: products,
                pageTitle: "Products List",
                path: '/admin/products',
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error')
            });
        }).catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while fetching products.";
            return next(error);
        });
};

exports.getAddProductPage = (req, res, next) => {
    console.log("getAddProductPage == okok");
    return res.render('ejs-templates/admin/add-product', {
        pageTitle: "Add Product",
        path: '/admin/add-product',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error'),
        errors: [],
        oldInputs: {
            title: '',
            price: '',
            description: ''
        }
    });
};

exports.postStoreProduct = (req, res, next) => {
    const title = req.body.title;
    const imageFile = req.file;
    const image = imageFile.path;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({ title: title, description: description, image: image, price: price, userID: req.user });
    product.save()
        .then(result => {
            req.flash('success', 'Product Added Successfully!');
            return res.status(200).redirect('/admin/products');
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while adding new product.";
            return next(error);
        });
};

exports.getEditProductPage = (req, res, next) => {
    let id = req.params.productID;
    const editMode = req.query.edit;
    if (!editMode) {
        req.flash('warning', 'Something went wrong may be editing mode!');
        return res.status(400).redirect('/admin/products');
    }
    if (!id) {
        req.flash('error', 'No Product Found!');
        return res.status(404).redirect('/admin/products');
    }
    Product.findById(id)
        .then(product => {
            if (product.userID.toString() != req.user._id.toString()) {
                req.flash('error', "Don't have correct permission!");
                return res.redirect('/');
            }
            // console.log(product);
            return res.render('ejs-templates/admin/edit-product', {
                pageTitle: "Edit Product",
                path: '/admin/edit-product',
                product: product,
                successMessage: req.flash('success'),
                warningMessage: req.flash('warning'),
                errorMessage: req.flash('error'),
                errors: [],
                oldInputs: {
                    title: '',
                    price: '',
                    description: ''
                }
            });
        }).catch(err => {
            console.log("getEditProductPage == err = ", err);
            // let error = new Error(err);
            // error.httpStatusCode = 500;
            // error.message = "Error while fetching product data to edit.";
            // return next(error);
        });
};

exports.postUpdateProduct = (req, res, next) => {
    const id = req.body.productID;
    const title = req.body.title;
    const imageFile = req.file;
    let image = null;
    if (imageFile.path) {
        image = imageFile.path;
        // console.log("ok",image)
        // return;
    }
    // console.log("not",image)
    // return;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(id)
        .then(product => {
            if (product.userID.toString() != req.user._id.toString()) {
                req.flash('error', "Don't have correct permission!");
                return res.redirect('/');
            }
            product.title = title;
            product.description = description;
            product.price = price;
            if (image) {
                fileHelpers.deleteFile(product.image);
                product.image = image;
            }
            return product.save();
        })
        .then(result => {
            req.flash('success', 'Product Updated Successfully!');
            return res.status(200).redirect('/admin/products');
        }).catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while updating product data.";
            return next(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productID;
    Product.findById(id).then(product => {
        if (product.userID.toString() != req.user._id.toString()) {
            req.flash('error', "Don't have correct permission!");
            return res.redirect('/');
        }
        fileHelpers.deleteFile(product.image);
        return product.delete((err) => {
            req.flash('success', 'Product Deleted Successfully!');
            return res.status(200).redirect('/admin/products');
        });
    }).catch(err => {
        let error = new Error(err);
        error.httpStatusCode = 500;
        error.message = "Error while deleting product.";
        return next(error);
    });
};