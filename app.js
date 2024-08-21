/* Import d'express */
const express = require('express');

/* Import de sequelize */
const sequelize = require('./src/DB/sequelize');

/* Import de cors*/
const cors = require('cors');

/* Creer une instance de l'application express (serveur web) */
const app = express();

/* Accès au path du server */
const path = require('path');

/* Middleware pour parser le corps de la requête */
app.use(express.json());

/* Middleware pour autoriser l'acces depuis n'importe quelle origine */
app.use(cors());


/* Initialisation de la base de données */
sequelize.initDb();

/* Importer les routes */
const phrasesRoutes = require('./src/Routes/phrase')
const sallesRoutes = require('./src/Routes/salle')
const gamemastersRoutes = require('./src/Routes/gamemaster')
const userRoutes = require('./src/Routes/user')
const connexionRoutes = require('./src/Routes/connexion')
const grillesRoutes = require('./src/Routes/grille');

/* Utilisation des routes */
app.use('/images', express.static(path.join(__dirname, '/images')));

app.use('/api/phrases', phrasesRoutes)
app.use('/api/salles', sallesRoutes)
app.use('/api/gamemasters', gamemastersRoutes)
app.use('/api/users', userRoutes)
app.use('/api/connexion', connexionRoutes)
app.use('/api/grilles', grillesRoutes);


/* Export de l'application */
module.exports = app;
