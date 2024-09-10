/* L’API Rest et la Base de données : Créer un modèle Sequelize */

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


/* Import du paquet bcrypt */
const bcrypt = require('bcrypt')

let sequelize

if (process.env.NODE_ENV === 'production') {
    /* Connexion a la base de données en production */
    sequelize = new Sequelize('nomBdD', 'user', 'password', {
        host: 'nomHost',
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
        console.log('La base de donnée a bien été initialisée !');

        /* Creation d'une salle */
        await Salle.create({ name: "Générale" });
        await Salle.create({ name: "512 : Chevaliers et Enchanteurs" });
        await Salle.create({ name: "1994 : Magie et Sortilèges" });
        await Salle.create({ name: "1965 : Enquête et Roman Noir" });
        await Salle.create({ name: "2006 : Hold-Up à Vegas"});
        await Salle.create({ name: "1999 : Murder Story" });
        


        // Création des rôles
        const adminRole = await Role.create({ name: 'ADMIN' });
        console.log(adminRole.toJSON());
        const gameMasterRole = await Role.create({ name: 'GAMEMASTER' });
        console.log(gameMasterRole.toJSON());

        // Cryptage du mot de passe
        const hash = await bcrypt.hash('bingo', 10);

        // Création d'un user avec le mot de passe crypté et le rôle existant
        const seb = await User.create({
            email: 'sebastien.divers@gmail.com',
            password: hash,
            pseudo: 'Seb',
        });

        const emma = await User.create({
            email: 'emmacremeauxdev@gmail.com',
            password: hash,
            pseudo: 'Emma',
        });

        // Creation d'un user test
        const test = await User.create({
            email: 'test@gmail.com',
            password: hash,
            pseudo: 'test',
        });

        // Association des roles admin et gamemaster à l'utilisateur
        await seb.addRole([adminRole, gameMasterRole]);
        await emma.addRole([gameMasterRole]);
        await test.addRole([adminRole, gameMasterRole]);

        // Association de l'utilisateur à une salle
        await seb.addSalle([ 1, 2, 6 ]);
        await emma.addSalle([ 1, 3, 4, 5 ]);
        await test.addSalle([ 1 ]);


        // creation des phrases pour la salle 1
        await Phrase.create({ text: "phrase 1 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 2 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 3 salle générale!", SalleId: 1 });
        await Phrase.create({ text: "phrase 4 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 5 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 6 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 7 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 8 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 9 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 10 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 11 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 12 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 13 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 14 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 15 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 16 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 17 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 18 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 19 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 20 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 21 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 22 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 23 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 24 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 25 salle générale", SalleId: 1 });
        await Phrase.create({ text: "phrase 26 salle générale", SalleId:1 });
        await Phrase.create({ text: "phrase 27 salle générale", SalleId: 1 });

        // creation des phrases pour la salle 2
        await Phrase.create({ text: "phrase 1 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 2 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 3 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 4 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 5 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 6 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 7 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 8 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 9 salle 2", SalleId: 2 });
        await Phrase.create({ text: "phrase 10 salle 2", SalleId: 2 });

        // creation des phrases pour la salle 3
        await Phrase.create({ text: "phrase 1 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 2 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 3 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 4 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 5 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 6 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 7 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 8 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 9 salle 3", SalleId: 3 });
        await Phrase.create({ text: "phrase 10 salle 3", SalleId: 3 });

        // creation des phrases pour la salle 4
        await Phrase.create({ text: "phrase 1 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 2 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 3 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 4 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 5 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 6 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 7 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 8 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 9 salle 4", SalleId: 4 });
        await Phrase.create({ text: "phrase 10 salle 4", SalleId: 4 });

        // creation des phrases pour la salle 5
        await Phrase.create({ text: "phrase 1 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 2 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 3 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 4 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 5 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 6 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 7 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 8 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 9 salle 5", SalleId: 5 });
        await Phrase.create({ text: "phrase 10 salle 5", SalleId: 5 });

        // creation des phrases pour la salle 6
        await Phrase.create({ text: "phrase 1 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 2 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 3 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 4 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 5 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 6 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 7 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 8 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 9 salle 6", SalleId: 6 });
        await Phrase.create({ text: "phrase 10 salle 6", SalleId: 6 });
        

        /* Creation d'un gamemaster */
        await Gamemaster.create({ email: "emma.cremeaux@hotmail.fr" });



    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données: ', error);
    }
}

module.exports = {
    initDb, User, Role, Phrase, Salle, Gamemaster, Grille
}