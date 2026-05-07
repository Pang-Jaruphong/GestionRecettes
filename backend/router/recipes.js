import express from 'express';
import {dbRecipes} from '../db/dbRecieps.js';

const recipesRouter = express.Router();

recipesRouter.get('/',async (req, res) => {
    try {
        const recipes = await dbRecipes.getAllRecipes();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({err: "Impossible de connexion de la base de données"});
    }
})

recipesRouter.get('/top', async (req, res) => {
    try {
        const topRecipes = await dbRecipes.getTopRecipes();
        res.json(topRecipes);
    } catch (err) {
        res.status(500).json({err:"Impossible de connexion de la base de données"})
    }
})

recipesRouter.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await dbRecipes.getDetailRecipes(id);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Recette non trouvée" });
        }

        // create object first
        const recipe = {
            id: rows[0].id,
            title: rows[0].title,
            category: rows[0].category,
            prepareTime: rows[0].prepareTime,
            cookTime: rows[0].cookTime,
            portion: rows[0].portion,
            photo: rows[0].photo,
            description: rows[0].description,
            moyNote: rows[0].moyNote,

            ingredients: []

        }

        // Add ingrédients
        rows.forEach(row => {
            recipe.ingredients.push({
                    name: row.ingredients,
                    quantity :row.quantity,
                    unity:row.unity
                })
        })

        res.json(recipe);

    } catch (err) {
        res.status(500).json({err:"Impossible de connexion de la base de données en détail"});
    }
})

export default recipesRouter;