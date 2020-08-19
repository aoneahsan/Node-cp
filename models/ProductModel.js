const CartModel = require('./CartModel');
const db = require('./../utils/database');

module.exports = class ProductModel {
    constructor(id, title, image, price, description) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.price = price;
        this.description = description;
    }

    save() {
        return db.execute(`INSERT INTO products (title, description, image, price) VALUES ("${this.title}", "${this.description}", "${this.image}", "${this.price}")`);
    }

    update() {
        return db.execute(`update products set title = "${this.title}", description = "${this.description}", image = "${this.image}", price = "${this.price}" where id = ${this.id}`);
    }

    static fetchProducts() {
        return db.execute('select * from products');
    }

    static getProduct(id) {
        return db.execute(`select * from products where id = ${id}`);
    }

    static deleteProduct(id) {
        return db.execute(`delete from products where id = ${id}`);
    }
};