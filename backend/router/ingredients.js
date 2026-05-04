import express from "express";
import {dbIngredients} from "../db/dbIngredients.js";

const ingredientsRouter = express.Router();

ingredientsRouter.get("/", async (req, res) => {
    try {
        const ingredients = await dbIngredients.getAll();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({err : "Impossible de la connexion de la base de données"});
    }
})

export default ingredientsRouter;