import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

import ingredientsRouter from './router/ingredients.js';

app.use(express.json());
app.use(cors());

app.use('/ingredients', ingredientsRouter);

app.get('/', (req, res)=>{
    res.send('Système de gestion des recettes');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});