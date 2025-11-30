const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',   // tu contraseña si tiene
    database: 'ecommerce'
});

module.exports = pool;
