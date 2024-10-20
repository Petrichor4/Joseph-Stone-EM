"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432, // default PostgreSQL port
});
exports.pool = pool;
const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
    }
    catch (error) {
        console.log('Error connecting to the database: ', error);
        process.exit(1);
    }
};
exports.connectToDb = connectToDb;
