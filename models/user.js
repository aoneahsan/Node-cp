const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    cart: {
        items: {
            type: [
                {
                    productID: {
                        type: Schema.Types.ObjectId,
                        ref: 'Product',
                        require: true
                    },
                    quantity: {
                        type: Number,
                        require: true
                    }
                }
            ]
        }
    }
});

userSchema.methods.addToCart = function (prodID) {
    let updatedCart = { ...this.cart };
    let cartProductIndex = this.cart.items.findIndex(cpi => cpi.productID == prodID);
    let newCartProduct = { productID: prodID, quantity: 1 };
    if (cartProductIndex < 0) {
        updatedCart.items.push(newCartProduct);
    } else {
        updatedCart.items[cartProductIndex].quantity += 1;
    }
    // console.log("user cart before update updatedCart = ", updatedCart);
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (prodID) {
    let updatedCart = this.cart;
    updatedCart.items = this.cart.items.filter(el => {
        return el.productID != prodID;
    });
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);