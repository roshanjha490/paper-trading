import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  port: 3306,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10, // Adjust this value based on your requirements
  queueLimit: 0 // Unlimited queueing
});

export default pool;