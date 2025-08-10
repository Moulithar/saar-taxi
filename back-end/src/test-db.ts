import connection from './db.js';

async function testConnection() {
    try {
        const [rows] = await connection.query('SELECT 1 + 1 AS solution');
        console.log('Database connection test passed!', rows);
        await connection.end();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testConnection();