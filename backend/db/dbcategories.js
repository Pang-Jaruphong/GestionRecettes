import {db} from './database.js';

const dbCategories = {
    getAll: async () => {
        const sql = "SELECT * FROM categories ORDER BY id";
        return await db.query(sql);
    }
}

export {dbCategories};