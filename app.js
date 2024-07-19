/* Import d'express */
const express = require('express')

/* Import de sequelize */
const sequelize = require('./src/DB/sequelize')

/* Import de cors*/
const cors = require('cors')

/* Creer une instance de l'application express  (serveur web) */
const app = express()

/* Middleware pour parser le corps de la requête */
app.use(express.json())

/* Middleware pour autoriser l'acces depuis n'importe quelle origine */
app.use(cors())

/* Initialisation de la base de données */
sequelize.initDb()

/* Importer les routes */
const phrasesRoutes = require('./src/Routes/phrase')
const sallesRoutes = require('./src/Routes/salle')
const gamemastersRoutes = require('./src/Routes/gamemaster')

/* Utilisation des routes */
app.use('/api/phrases', phrasesRoutes)
app.use('/api/salles', sallesRoutes)
app.use('/api/gamemasters', gamemastersRoutes)

/*  Export de l'application */
module.exports = app;