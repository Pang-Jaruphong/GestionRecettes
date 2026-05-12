import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// service fils static, middleware integrate Express, join current working directory ( abdolate file )
app.use(express.static(path.join(process.cwd(), '../frontend')));

import ingredientsRouter from './router/ingredients.js';
import authRouter from './router/auth.js';
import recipesRouter from './router/recipes.js';
import categoriesRouter from "./router/categories.js";

app.use('/ingredients', ingredientsRouter);
app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);
app.use('/categories', categoriesRouter);


app.get('/', (req, res)=>{
    res.send('Système de gestion des recettes');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});