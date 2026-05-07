import {db} from './database.js';

const dbRecipes = {
    getAllRecipes: async () => {
        const sql = `
            SELECT  r.id, r.title, r.photo, 
                    r.moyNote, 
                    c.name AS category 
            FROM recipes r
            JOIN categories c ON r.category_id = c.id
            ORDER BY r.id`;
        return await db.query(sql);
    },

    getTopRecipes: async () => {
        const sql = `
            SELECT  r.id, r.title, r.photo, 
                    r.moyNote, 
                    c.name AS category 
            FROM recipes r
            JOIN categories c ON r.category_id = c.id
            WHERE r.moyNote > 4
            ORDER BY r.id
            LIMIT 5`;
        return await db.query(sql);
    },

    getDetailRecipes: async (id) => {
        const sql = `
            SELECT  r.id, r.title, c.name AS category,
                    r.prepareTime, r.cookTime, r.portion, r.photo,
                    i.name AS ingredients, rhi.quantity, 
                    rhi.unity, 
                    r.description, r.moyNote
            FROM recipes_has_ingredients rhi
            JOIN recipes r ON rhi.recipe_id = r.id
            JOIN categories c ON r.category_id = c.id
            JOIN ingredients i on rhi.ingredient_id = i.id
            WHERE r.id = ?`;
        return await db.query(sql, [id]);
    }
}


export {dbRecipes};