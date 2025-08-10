import mysql from 'mysql2/promise';

// Temporary connection - we'll improve this later
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',        // XAMPP default username
    password: '',        // XAMPP default has no password
    database: 'saar_taxi'  // We'll create this
});


console.log("Connected to MySQL!");
export default connection;