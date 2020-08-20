const Sequelize = require('sequelize');

const sequelizeDB = require('./../utils/database');
const order = sequelizeDB.define('order', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = order;