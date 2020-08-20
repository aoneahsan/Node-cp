const Sequelize = require('sequelize');

const sequelizeDB = require('../utils/database');
const orderItem = sequelizeDB.define('orderItem', {
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

module.exports = orderItem;