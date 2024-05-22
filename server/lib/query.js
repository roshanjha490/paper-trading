const mysql = require('mysql2/promise');
require('dotenv').config();

async function query(query) {

    const dbconnection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        port: 3306,
        password: process.env.DB_PASSWORD,
    });

    const data = await dbconnection.query(query)

    dbconnection.end()

    return data
}


module.exports = {
    query
};