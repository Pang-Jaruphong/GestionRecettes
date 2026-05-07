import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// dotenv go to .env, 2 files before
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
})

export const db = {

    // function general for all requetes
    query: async (sql, params) => {
        const [results] = await pool.execute(sql, params);
        return results;
    },

    closePool1: async ()=>{
        await pool.end();
    }
}

export default db;