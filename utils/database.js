const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    database: "node_node-course-project",
    user: "root",
    password: ''
});

module.exports = pool.promise();