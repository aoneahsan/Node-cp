const mongoDB = require('mongodb');
const getDB = require('./../utils/database').getDB;

class User {
    constructor(id, name, email, cart) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cart = cart;
    }

    save() {
        const db = getDB();
        return db.collection('users')
            .insertOne(this)
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(err => console.log(err));
    }

    static findByPk(id) {
        const db = getDB();
        return db.collection('users')
            .find({ _id: new mongoDB.ObjectID(id) }).next()
            .then(user => {
                if (user) {
                    user.id = user._id;
                    // console.log(user);
                    return user;
                }
                else {
                    return user;
                }
            })
            .catch(err => console.log(err));
    }

    getCart() {
        let userCartItems = this.cart.items;
        let cartProducts = [];
        let cartTotalPrice = 0;
        let cartProductsIDs = this.cart.items.map(el => {
            return new mongoDB.ObjectID(el.productID);
        })
        const db = getDB();
        return db.collection('products')
            .find({ _id: { $in: cartProductsIDs } })
            .toArray()
            .then(fetchedProducts => {
                const products = fetchedProducts.map(el => {
                    el.id = el._id;
                    return el;
                });
                // this logic is to delete product from cart if product is itself deleted by admin
                let ProductsIDsToDeleteFromCart = [];

                // console.log("products(1), cartProductsIDs(2)", products, cartProductsIDs);
                if (userCartItems.length > 0) {
                    for (let product of products) {
                        let cartProduct = userCartItems.find(el => el.productID == product.id);
                        let deleteProduct = userCartItems.find(el => el.productID != product.id);
                        // console.log("userCartItems, cartProduct, product", userCartItems, cartProduct, product);
                        if (cartProduct) {
                            cartProducts.push({ product: product, quantity: cartProduct.quantity });
                            cartTotalPrice = cartTotalPrice + (+product.price * +cartProduct.quantity);
                        }
                        if (deleteProduct) {
                            ProductsIDsToDeleteFromCart.push(deleteProduct.productID);
                        }
                    }
                    if (ProductsIDsToDeleteFromCart.length > 0) {
                        console.log("ProductsIDsToDeleteFromCart = ", ProductsIDsToDeleteFromCart);
                        let cartItemsAfterDeletingExtraProducts = [];
                        for (let prodIDToRemove of ProductsIDsToDeleteFromCart) {
                            let newCartItem = this.cart.items.find(el => el.productID != prodIDToRemove);
                            if (newCartItem) {
                                cartItemsAfterDeletingExtraProducts.push(newCartItem);
                            }
                        }
                        return db.collection('users')
                            .updateOne({ _id: new mongoDB.ObjectID(this.id) }, { $set: { cart: { items: cartItemsAfterDeletingExtraProducts } } })
                            .then(result => {
                                return { products: cartProducts, totalPrice: cartTotalPrice };
                            })
                            .catch(err => console.log(err));
                    }
                    else {
                        return { products: cartProducts, totalPrice: cartTotalPrice };
                    }
                }
                else {
                    return { products: cartProducts, totalPrice: cartTotalPrice };
                }
            })
    }

    addToCart(prodID) {
        let updatedCart;
        let cartProductIndex = this.cart.items.findIndex(cpi => cpi.productID == prodID);
        updatedCart = { ...this.cart };
        let newCartProduct = { productID: prodID, quantity: 1 };
        if (cartProductIndex < 0) {
            updatedCart.items.push(newCartProduct);
        } else {
            updatedCart.items[cartProductIndex].quantity += 1;
        }
        // console.log("user cart before update updatedCart = ", updatedCart);
        const db = getDB();
        return db.collection('users')
            .updateOne({ _id: new mongoDB.ObjectID(this.id) }, { $set: { cart: updatedCart } })
            .then(result => {
                // console.log("user cart update result = ", result);
                return result;
            })
            .catch(err => console.log(err));
    }

    removeFromCart(prodID) {
        let updatedCart = this.cart;
        updatedCart.items = this.cart.items.filter(el => {
            return el.productID != prodID;
        });
        const db = getDB();
        return db.collection('users')
            .updateOne({ _id: new mongoDB.ObjectID(this.id) }, { $set: { cart: updatedCart } })
            .then(result => {
                return result;
            })
            .catch(err => console.log(err));
    }

    getOrders() {
        const db = getDB();
        return db.collection('orders')
            .find({ 'user.id': new mongoDB.ObjectID(this.id) })
            .toArray()
            .then(orders => {
                return orders;
            })
            .catch(err => console.log(err));
    }

    placeOrder() {
        const db = getDB();
        return this.getCart()
            .then(cart => {
                let order = {
                    products: cart.products,
                    totalPrice: cart.totalPrice,
                    user: {
                        id: this.id,
                        name: this.name,
                        email: this.email
                    }
                };
                return db.collection('orders')
                    .insertOne(order);
            })
            .then(result => {
                this.cart = [];
                // console.log("user cart update result = ", result);
                return db.collection('users')
                    .updateOne({ _id: new mongoDB.ObjectID(this.id) }, { $set: { cart: { items: [] } } });
            })
            .then(result => {
                return result;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;