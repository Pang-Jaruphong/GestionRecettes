import express from "express";
import {dbCategories} from "../db/dbCategories.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/", async (req, res) => {
    try {
        const categories = await dbCategories.getAll();
        res.json(categories);
    } catch (err) {
        res.status(500).json({err : "Impossible de la connexion de la base de données"});
    }
})

export default categoriesRouter;