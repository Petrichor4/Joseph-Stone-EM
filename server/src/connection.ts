import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'your_db_host',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432, // default PostgreSQL port
});
const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.log('Error connecting to the database: ', error);
        process.exit(1);
    }
}
export { pool, connectToDb };