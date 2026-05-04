import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 6000;


app.use(express.json());
app.use(cors());



app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});