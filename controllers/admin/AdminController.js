const Product = require('../../models/product');
const User = require('../../models/user');

exports.getProducts = (req, res, next) => {
    Product.fetchAll().then(products => {
        return res.render('ejs-templates/admin/products', {
            prods: products,
            pageTitle: "Products List",
            path: '/admin/products'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getAddProductPage = (req, res, next) => {
    res.render('ejs-templates/admin/add-product', {
        pageTitle: "Add Product",
        path: '/admin/add-product'
    });
};

exports.postStoreProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const userID = req.user.id;
    const product = new Product(title, description, image, price, userID);
    product.save()
        .then(result => {
            return res.status(200).redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getEditProductPage = (req, res, next) => {
    let id = req.params.productID;
    const editMode = req.query.edit;
    if (!editMode) {
        return res.status(400).redirect('/admin/products');
    }
    if (!id) {
        return res.status(404).redirect('/admin/products');
    }
    Product.findByPk(id).then(product => {
        console.log(product);
        return res.render('ejs-templates/admin/edit-product', {
            pageTitle: "Edit Product",
            path: '/admin/edit-product',
            product: product
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postUpdateProduct = (req, res, next) => {
    const id = req.body.productID;
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const userID = req.user.id;
    const product = new Product(title, description, image, price, userID);
    product.update(id).then(result => {
        // console.log(result);
        return res.status(200).redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productID;
    Product.destroy(id).then(result => {
        // console.log(result);
        return res.status(200).redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};