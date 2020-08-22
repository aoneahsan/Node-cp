const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: {
        type: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    require: true,
                    ref: 'Product'
                },
                title: String,
                description: String,
                price: Number,
                image: String,
                userID: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                quantity: Number
            }
        ],
        require: true
    },
    orderTotalPrice: Number,
    user: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        name: String,
        email: String
    }
});

module.exports = mongoose.model('Order', orderSchema);