const ProductModel = require('../../models/ProductModel');

// exports.getProducts = (req, res, next) => {
//     ProductModel.fetchProducts(prods => {
//         res.render('ejs-templates/admin/products', {
//             pageTitle: "Admin Products",
//             path: '/admin/products',
//             products: prods
//         });
//     });
// };

exports.getProducts = (req, res, next) => {
    ProductModel.fetchProducts(products => {
        res.render('ejs-templates/admin/products', {
            prods: products,
            pageTitle: "Products List",
            path: '/admin/products'
        })
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
    product.save(() => {
        res.redirect('/admin/products');
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
    ProductModel.getProduct(id, (product) => {
        if (!product) {
            return res.status(404).redirect('/admin/products');
        }
        res.render('ejs-templates/admin/edit-product', {
            pageTitle: "Edit Product",
            path: '/admin/edit-product',
            product: product
        })
    });
};

exports.postUpdateProduct = (req, res, next) => {
    const id = req.body.productID;
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    const product = new ProductModel(id, title, image, price, description);
    product.save(() => {
        res.redirect('/admin/products');
    });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productID;
    ProductModel.deleteProduct(id, (result) => { // result will be true, false
        if (result) {
            res.redirect('/admin/products');
        } else {
            console.log("error occured while deleting product");
            res.redirect('/admin/products');
        }
    });
};