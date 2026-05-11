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
        const recipe = await dbRecipes.getDetailRecipes(id);

        if (!recipe) {
            return res.status(404).json({ message: "Recette non trouvée" });
        }

        res.json(recipe);

    } catch (err) {
        res.status(500).json({err:"Impossible de connexion de la base de données en détail"});
    }
})

export default recipesRouter;