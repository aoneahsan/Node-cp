const ProductModel = require('../../models/ProductModel');

exports.getProducts = (req, res, next) => {
    ProductModel.fetchProducts()
        .then(result => {
            // console.log(result);
            const products = result[0];
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
    const product = new ProductModel(null, title, image, price, description);
    product.save().then(result => {
        // console.log(result);
        return res.status(200).redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
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
    ProductModel.getProduct(id).then(result => {
        console.log(result);
        const _product = result[0][0];
        if (!_product) {
            return res.status(404).redirect('/admin/products');
        }
        return res.render('ejs-templates/admin/edit-product', {
            pageTitle: "Edit Product",
            path: '/admin/edit-product',
            product: _product
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
    const product = new ProductModel(id, title, image, price, description);
    product.update().then(result => {
        // console.log(result);
        return res.status(200).redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productID;
    ProductModel.deleteProduct(id).then(result => {
        // console.log(result);
        return res.status(200).redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};