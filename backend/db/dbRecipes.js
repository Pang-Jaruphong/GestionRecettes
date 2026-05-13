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
                    i.name AS ingredients, 
                    rhi.quantity, 
                    rhi.unity, 
                    r.description, r.moyNote
            FROM recipes r
            JOIN categories c ON r.category_id = c.id
            LEFT JOIN recipes_has_ingredients rhi ON rhi.recipe_id = r.id
            LEFT JOIN ingredients i on rhi.ingredient_id = i.id
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

            ingredients: rows
                .filter(row => row.ingredients !== null)
                .map(row => ({
                    name: row.ingredients,
                    quantity: row.quantity,
                    unity: row.unity
            }))

        };
        return await db.query(sql, [id]);
    },

    addReview: async (recipeId, note) => {
        const sql = `
            INSERT INTO reviews(value, recipe_id) 
            VALUES (?,?)`;
        return await db.query(sql, [note, recipeId]);
    },

    updateAverageNote: async (recipeId) => {
        const sql = `
            UPDATE recipes
            SET moyNote = (
                SELECT AVG(value) FROM reviews
                WHERE recipe_id = ?
                )
                WHERE id = ?`;
        return await db.query(sql, [recipeId, recipeId]);
    },

    createRecipe: async (recipe) => {
        const sql = `
            INSERT INTO recipes
                (title, prepareTime, cookTime, portion, description, photo, moyNote, category_id)
                VALUES (?,?,?,?,?,?,0,?)
            `;
        const result = await db.query(sql, [
            recipe.title,
            recipe.prepareTime,
            recipe.cookTime,
            recipe.portion,
            recipe.description,
            recipe.photo,
            recipe.category_id
        ]);

        const recipeId = result.insertId;

        for (const ingredient of recipe.ingredients) {
            const sqlIngredient =`
                INSERT INTO recipes_has_ingredients
                (recipe_id, ingredient_id, quantity, unity)
                VALUES (?,?,?,?)
            `;
            await db.query(sqlIngredient, [
                recipeId,
                ingredient.ingredient_id,
                ingredient.quantity,
                ingredient.unity,
            ]);
        }
        return recipeId;
    },

    deleteRecipe: async (recipeId) => {
        // delete fk put ON CASCADE
        await db.query(
            `DELETE FROM recipes_has_ingredients WHERE recipe_id = ?`,
            [recipeId]
        );

        await db.query(
            `DELETE FROM reviews WHERE recipe_id = ?`,
            [recipeId]
        );

        const sql = `
            DELETE FROM recipes WHERE id = ?`;

        return await db.query(sql, [recipeId]);
    }

}


export {dbRecipes};