const fs = require('fs');
const path = require('path');

const CartModel = require('./CartModel');

const productsFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProducts = cb => {
    fs.readFile(productsFilePath, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class ProductModel {
    constructor(id, title, image, price, description) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.price = price;
        this.description = description;
    }

    save(callback) {
        getProducts(products => {
            let index = products.findIndex(el => el.id == this.id);
            if (index < 0) {
                this.id = Math.round(Math.random() * 1000000000);
                products.push(this);
                fs.writeFile(productsFilePath, JSON.stringify(products), err => {
                    console.log(err);
                    return callback();
                });
            } else {
                products[index] = this;
                fs.writeFile(productsFilePath, JSON.stringify(products), err => {
                    console.log(err);
                    return callback();
                });
            }
        });
    }

    static fetchProducts(callback) {
        getProducts(callback);
    }

    static getProduct(id, callback) {
        getProducts(products => {
            let product = products.find(el => el.id == id);
            callback(product);
        })
    }

    static deleteProduct(id, callback) {
        getProducts(products => {
            let index = products.findIndex(el => el.id == id);
            if (index < 0) {
                return callback(null);
            }
            let updatedProduct = products.filter(el => el.id != id);
            fs.writeFile(productsFilePath, JSON.stringify(updatedProduct), err => {
                // console.log(err);
                if (err) {
                    return callback(null);
                }
                CartModel.removeProduct(id, (result) => { // result will be true, false
                    if (result) {
                        return callback(true);
                    } else {
                        return callback(false);
                    }
                });
            });
        });
    }
};