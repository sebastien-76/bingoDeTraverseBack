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
    return sequelize.sync({ force: true }).then(_ => {
                /* Création des roles */
                Role.create({
                    name: 'ADMIN'
                }).then(role => console.log(role.toJSON()))
                Role.create({
                    name: 'GAMEMASTER'
                }).then(role => console.log(role.toJSON()))
        
                /* Cryptage du mot de passe */
                /* Utilisation de la fonction hash avec le mot de passe et le saltRounds */
                bcrypt.hash('bingo', 10)
                    .then(hash => {
                        /* Création d'un user avec le mot de passe crypté */
                        User.create({
                            email: 'sebastien.divers@gmail.com',
                            password: hash,
                            nom: 'MAILLET',
                            prenom: 'Sebastien',
                            pseudo: 'Seb',
                            roles: [
                                { name: 'ADMIN'}
                                ],
                        }, { include: Role, }).then(user => console.log(user.toJSON()))
                    })
        console.log('La base de donnée a bien été initialisée !')
    })
}

module.exports = {
    initDb, User, Role
}