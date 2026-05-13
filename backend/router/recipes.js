import express from 'express';
import {dbRecipes} from '../db/dbRecipes.js';
import {verifyToken} from '../middleware/authMiddleware.js';

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

recipesRouter.post("/:id/reviews", async (req, res) => {

    try {
        const { id } = req.params;
        const { note } = req.body;

        await dbRecipes.addReview(id, note);
        await dbRecipes.updateAverageNote(id);

        res.json({
            message: "Avis ajouté"
        });
    } catch (err) {
        res.status(500).json({
            message: "Erreur ajout avis"
        });
    }
});

recipesRouter.post('/', verifyToken, async (req, res) => {

    try {

        const recipeId = await dbRecipes.createRecipe(req.body);

        res.status(201).json({
            message: "Recette ajoutée",
            id: recipeId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Erreur ajout recette"
        });
    }
});

recipesRouter.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await dbRecipes.deleteRecipe(id);

        res.status(200).json({
            message : "La recette est supprimée avec succès"
        })
    } catch (err) {
        res.status(500).json({
            message: "Erreur du serveur"
    })
    }
})

export default recipesRouter;