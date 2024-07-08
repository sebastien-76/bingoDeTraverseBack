/* Récupération du paquet express */
const express = require('express')

/* Creer une instance de l'application express  (serveur web) */
const app = express()

/* Middleware pour parser le corps de la requête */
app.use(express.json())

/* Importer les routes */

/*  Export de l'application */
module.exports = app;