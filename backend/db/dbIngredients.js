import {db} from './database.js';

const dbIngredients = {
    getAll: async () => {
        const sql = "SELECT * FROM ingredients ORDER BY id";
        return await db.query(sql);
    }
}

export {dbIngredients};