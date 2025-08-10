import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saar_taxi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(conn => {
    console.log('Connected to MySQL!');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

export default pool;