const SequelizeClass = require('sequelize');

const sequelizeObj = new SequelizeClass('node_node-course-project', 'root', '', { host: 'localhost', dialect: 'mysql' });

module.exports = sequelizeObj;