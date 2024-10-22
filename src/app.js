import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routerAPI from './api/v1/routes/index'
// Config para variables de entorno
import config from './config/config';

// Declaramos la variable app igualandola a express
const app = express();
import { mongoose } from './config/database.config';

// Settings
app.set('port', config.PORT);

// Middlewares generales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const api = config.API_URL;
app.get(`${api}`, (req, res) => {
    res.send(
        `<h1>La aplicacion esta corriendo Correctamente.</h1> 
        <p> eCommerce: <b>${api}/api-docs</b> para mas Informacion.</p>`
    );
})

app.get('/JRTN', (req, res) => {
    res.send(
        `<h1>RESTful corriendo en JRTN</h1> 
        <p> eCommerce: <b>${api}/api-docs</b> para mas informacion.</p>`
    );
})

routerAPI(app);

export default app;