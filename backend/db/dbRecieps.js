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

        // create object first
        const rows = await db.query(sql, [id]);
        if (rows.length === 0) {
            return null;
        }

        // transform lines QSL in a objet
        return {
            id: rows[0].id,
            title: rows[0].title,
            category: rows[0].category,
            prepareTime: rows[0].prepareTime,
            cookTime: rows[0].cookTime,
            portion: rows[0].portion,
            photo: rows[0].photo,
            description: rows[0].description,
            moyNote: rows[0].moyNote,

            ingredients: rows.map(row => ({
                name: row.ingredients,
                quantity: row.quantity,
                unity: row.unity
            }))

        };
        return await db.query(sql, [id]);
    }
}


export {dbRecipes};