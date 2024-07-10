/* Récupération du paquet express */
const express = require('express')

/* Importer le paquet sequelize */
const sequelize = require('./src/DB/sequelize')


/* Creer une instance de l'application express  (serveur web) */
const app = express()

/* Middleware pour parser le corps de la requête */
app.use(express.json())

/* Initialisation de la base de données */
sequelize.initDb()

/* Importer les routes */

/*  Export de l'application */
module.exports = app;