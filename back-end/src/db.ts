import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME || 'saar_taxi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

});

// Test the connection
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to Clever cloud MySQL');
    return conn.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).finally(() => conn.release());
  })
  .then(() => console.log('Todos table is ready'))
  .catch(err => console.error('Database connection failed:', err));

export default pool;