import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js'

await connectToDb();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});