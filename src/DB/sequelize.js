/* L’API Rest et la Base de données : Créer un modèle Sequelize */

/* Import de sequelize */
const { Sequelize, DataTypes } = require('sequelize')

/* Import du modèle user */
const UserModel = require('./models/user')

/* Import du modèle role */
const RoleModel = require('./models/role')

/* Import du modèle avatar */
const AvatarModel = require('./models/avatar')

/* Import du modèle phrase */
const PhraseModel = require('./models/phrase')

/* Import du modèle salle */
const SalleModel = require('./models/salle')

/* Import du modèle gamemaster */
const GamemasterModel = require('./models/gamemaster')


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

/* Instanciation du modèle  Avatar*/
const Avatar = AvatarModel(sequelize, DataTypes)

/* Instanciation du modèle  Salle*/
const Salle = SalleModel(sequelize, DataTypes)

/* Instanciation du modèle  Gamemaster*/
const Gamemaster = GamemasterModel(sequelize, DataTypes)

/* Association  Many to Many entre user et role */
User.belongsToMany(Role, { through: 'Users_Roles' })
Role.belongsToMany(User, { through: 'Users_Roles' })

/* Association  One to One entre user et avatar */
User.belongsTo(Avatar)
Avatar.hasOne(User)

/* Association  One to Many entre salle et phrase */
Salle.hasMany(Phrase)
Phrase.belongsTo(Salle)

/* Association Many to Many entre salle et User */
Salle.belongsToMany(User, { through: 'Salles_Users' })
User.belongsToMany(Salle, { through: 'Salles_Users' })


/* Synchro de la base de données ( option "force: true" pour vider la base) */
const initDb = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('La base de donnée a bien été initialisée !');

        /* Creation d'une salle */
        await Salle.create({ name: "512 : Chevaliers et Enchanteurs" });
        await Salle.create({ name: "1994 : Magie et Sortilèges" });
        await Salle.create({ name: "1965 : Enquête et Roman Noir" });
        await Salle.create({ name: "2006 : Hold-Up à Vegas"});
        await Salle.create({ name: "1999 : Murder Story" });
        await Salle.create({ name: "Générale" });


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
            lastname: 'MAILLET',
            firstname: 'Sebastien',
            pseudo: 'Seb',
        });

        const emma = await User.create({
            email: 'emma.cremeaux@gmail.com',
            password: hash,
            lastname: 'CREMAUX',
            firstname: 'Emma',
            pseudo: 'Emma',
        });

        // Association des roles admin et gamemaster à l'utilisateur
        await seb.addRole([adminRole, gameMasterRole]);
        await emma.addRole([gameMasterRole]);

        // Association de l'utilisateur à une salle
        await seb.addSalle([ 1, 2, 6 ]);
        await emma.addSalle([ 3, 4, 5 ]);

        /* Creation d'une phrase avec relation salle */
        await Phrase.create({ text: "Ca je te l'avais dit!", SalleId: 6 });
        await Phrase.create({ text: "yes", SalleId: 6 });
        await Phrase.create({ text: "trop bien!", SalleId: 6 });
        await Phrase.create({ text: "j'aime", SalleId: 6 });
        await Phrase.create({ text: "c'est nul", SalleId: 6 });
        await Phrase.create({ text: "j'ai trouvé", SalleId: 6 });
        await Phrase.create({ text: "un indice!", SalleId: 6 });
        await Phrase.create({ text: "je ne comprend rien", SalleId: 6 });
        await Phrase.create({ text: "tu pue", SalleId: 6 });
        await Phrase.create({ text: "laisse moi faire", SalleId: 6 });
        await Phrase.create({ text: "tu ne comprend pas", SalleId: 6 });
        await Phrase.create({ text: "ya quelqu'un?", SalleId: 6 });
        await Phrase.create({ text: "heho", SalleId: 6 });
        await Phrase.create({ text: "tu peux répéter", SalleId: 6 });
        await Phrase.create({ text: "salut", SalleId: 6 });
        await Phrase.create({ text: "j'ai peur!", SalleId: 6 });
        await Phrase.create({ text: "j'entend rien!", SalleId: 6 });
        await Phrase.create({ text: "je ne veux pas y aller", SalleId: 6 });
        await Phrase.create({ text: "je veux faire pipi", SalleId: 6 });
        await Phrase.create({ text: "hey c'est toi", SalleId: 6 });
        await Phrase.create({ text: "on est trop fort", SalleId: 6 });
        await Phrase.create({ text: "j'adore!", SalleId: 6 });
        await Phrase.create({ text: "j'ai péter", SalleId: 6 });
        await Phrase.create({ text: "ca s'ouvre", SalleId: 6 });
        await Phrase.create({ text: "salut", SalleId: 6 });
        await Phrase.create({ text: "coucou", SalleId: 6 });
        await Phrase.create({ text: "j'ai mal", SalleId: 6 });
        await Phrase.create({ text: "beurk", SalleId: 6 });

        /* Creation d'un gamemaster */
        await Gamemaster.create({ email: "emma.cremeaux@hotmail.fr" });

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données: ', error);
    }
}

module.exports = {
    initDb, User, Role, Phrase, Avatar, Salle, Gamemaster
}