const Sequelize = require('sequelize');

const sequelizeDB = require('../utils/database');
const cartItem = sequelizeDB.define('cartItem', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = cartItem;