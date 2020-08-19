const fs = require('fs');
const path = require('path');

const cartFilePath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class CartModel {
    static getCart(callback) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            return callback(cart);
        });
    }

    static addProduct(productID, productPrice, callback) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            let productIndex = cart.products.findIndex(el => el.id == productID);
            console.log(cart, productID, productPrice, productIndex);
            if (productIndex < 0) {
                let newProduct = { id: +productID, price: +productPrice, qty: 1 };
                cart.products.push(newProduct);
                cart.totalPrice = cart.totalPrice + +productPrice;
            }
            else {
                cart.products[productIndex].qty = cart.products[productIndex].qty + 1;
                cart.totalPrice = cart.totalPrice + +productPrice;
            }
            fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
                if (!err) {
                    return callback();
                }
            })
        });
    }

    static removeProduct(productID, callback) {
        fs.readFile(cartFilePath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            let productIndex = cart.products.findIndex(el => el.id == productID);
            if (productIndex < 0) {
                return callback(false);
            }
            else {
                const productData = cart.products[productIndex];
                let updatedProducts = cart.products.filter(el => el.id != productID);
                cart.products = updatedProducts;
                cart.totalPrice = cart.totalPrice - (productData.price * productData.qty);
            }
            fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
                if (!err) {
                    return callback(true);
                }
                else {
                    return callback(false);
                }
            })
        });
    }
}