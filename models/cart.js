const Sequelize = require('sequelize');

const sequelizeDB = require('./../utils/database');
const cart = sequelizeDB.define('cart', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = cart;