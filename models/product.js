const mongoDB = require('mongodb');
const getDB = require('./../utils/database').getDB;

class Product {
    constructor(title, description, image, price, userID) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.price = price;
        this.userID = userID;
    }

    save() {
        const db = getDB();
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(err => console.log(err));
    }

    update(id) {
        const db = getDB();
        return db.collection('products')
            .updateOne({ _id: new mongoDB.ObjectID(id) }, { $set: this })
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDB();
        return db.collection('products')
            .find().toArray()
            .then(products => {
                return products.map(product => {
                    product.id = product._id;
                    return product;
                });
            })
            .catch(err => console.log(err));
    }

    static findByPk(id) {
        const db = getDB();
        return db.collection('products')
            .find({ _id: new mongoDB.ObjectID(id) }).next()
            .then(product => {
                if (product) {
                    product.id = product._id;
                    // console.log(product);
                    return product;
                }
                else {
                    return product;
                }
            })
            .catch(err => console.log(err));
    }

    static destroy(id) {
        const db = getDB();
        return db.collection('products')
            .deleteOne({_id: new mongoDB.ObjectID(id)})
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;