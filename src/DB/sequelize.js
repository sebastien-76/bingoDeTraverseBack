/* L’API Rest et la Base de données : Créer un modèle Sequelize */

//import .env
require('dotenv').config();

/* Import de sequelize */
const { Sequelize, DataTypes } = require('sequelize')

/* Import du modèle user */
const UserModel = require('./models/user')

/* Import du modèle role */
const RoleModel = require('./models/role')

/* Import du modèle phrase */
const PhraseModel = require('./models/phrase')

/* Import du modèle salle */
const SalleModel = require('./models/salle')

/* Import du modèle gamemaster */
const GamemasterModel = require('./models/gamemaster')

/* Import du modèle grille */
const GrilleModel = require('./models/grille')

// Import des donnees
const users = require('./datas/users')
const gamemasters = require('./datas/gamemasters')
const roles = require('./datas/roles')
const salles = require('./datas/salles')
const phrases = require('./datas/phrases')

let sequelize

if (process.env.NODE_ENV === 'production') {
    /* Connexion a la base de données en production */
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: true
    })
} else {
    /* Connexion a la base de données en local */
    sequelize = new Sequelize(
        /* nom de la base */
        'bingoDeTraverse',
        /* nom d'utilisateur */
        'bingoDeTraverse',
        /* mot de passe */
        'bingoDeTraverse',
        /* optionnels */
        {
            host: 'localhost',
            dialect: 'mariadb',
            /* optionnels */
            dialectOptions: {
                timezone: 'Etc/GMT+2'
            },
            logging: false
        },
    )
}

/* Instanciation du modèle  User*/
const User = UserModel(sequelize, DataTypes)

/* Instanciation du modèle  Role*/
const Role = RoleModel(sequelize, DataTypes)

/* Instanciation du modèle  Phrase*/
const Phrase = PhraseModel(sequelize, DataTypes)

/* Instanciation du modèle  Salle*/
const Salle = SalleModel(sequelize, DataTypes)

/* Instanciation du modèle  Gamemaster*/
const Gamemaster = GamemasterModel(sequelize, DataTypes)

/* Instanciation du modèle  Grille*/
const Grille = GrilleModel(sequelize, DataTypes)

/* Association  Many to Many entre user et role */
User.belongsToMany(Role, { through: 'Users_Roles' })
Role.belongsToMany(User, { through: 'Users_Roles' })

/* Association  One to Many entre salle et phrase */
Salle.hasMany(Phrase, { onDelete: 'CASCADE' })
Phrase.belongsTo(Salle)

/* Association Many to Many entre salle et User */
Salle.belongsToMany(User, { through: 'Salles_Users' })
User.belongsToMany(Salle, { through: 'Salles_Users' })

/* Association  One to Many entre user et grille */
User.hasMany(Grille)
Grille.belongsTo(User)

/* Association Many to Many entre grille et phrase */
Grille.belongsToMany(Phrase, { through: 'Grilles_Phrases' })
Phrase.belongsToMany(Grille, { through: 'Grilles_Phrases' })


/* Synchro de la base de données ( option "force: true" pour vider la base) */
const initDb = async () => {
    try {
        await sequelize.sync({ force: true });

        // Création des rôles
        roles.map(role => {
            Role.create({
                name: role.name
            })
        })

        // Creation des salles
        salles.map(salle => {
            Salle.create({
                name: salle.name
            })
        })

        // Creation des gamemaster
        gamemasters.map(gamemaster => {
            Gamemaster.create({
                email: gamemaster.email
            })
        })

        // Création des users
        users.map(user => {
            User.create({
                email: user.email,
                password: user.password,
                pseudo: user.pseudo
            })
                .then(user => {
                    // Association des roles admin et gamemaster à l'utilisateur
                    user.addRole([1, 2]);
                    // Association de la salle 1 à l'utilisateur
                    user.addSalle([1]);
                });
        })

        // creation des phrases pour la salle 1
        phrases.map(phrase => {
            Phrase.create({
                text: phrase.text,
                SalleId: phrase.SalleId
            })
        })

        console.log('La base de donnée a bien été initialisée !');

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données: ', error);
    }
}

module.exports = {
    initDb, User, Role, Phrase, Salle, Gamemaster, Grille
}