const Sequelize = require('sequelize');

const sequelizeDB = require('../utils/database');
const user = sequelizeDB.define('user', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    profile_image: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = user;