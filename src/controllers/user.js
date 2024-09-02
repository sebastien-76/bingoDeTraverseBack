/* Import du modele User */
const { User } = require('../DB/sequelize');
/* Import du modele Role */
const { Role } = require('../DB/sequelize');
/* Import du modele GameMaster */
const { Gamemaster } = require('../DB/sequelize');
/* Import du modele Salle */
const { Salle } = require('../DB/sequelize');

const jwt = require('jsonwebtoken');
const privateKey = require('../Middleware/auth/private_key');

const fs = require('fs');


/* Import ValidationError et UniqueConstraintError de sequelize */
const { ValidationError, UniqueConstraintError } = require('sequelize')

/* Import du paquet bcrypt */
const bcrypt = require('bcrypt');


/* Export de la fonction création du user */
exports.signUp = async (req, res) => {
    const gameMasterMail = await Gamemaster.findOne({ where: { email: req.body.email } });

    if (gameMasterMail) {
        try {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const gameMasterRole = await Role.findOne({ where: { name: 'GAMEMASTER' } })
            const salleGenerale = await Salle.findOne({ where: { name: 'Générale' } })

            const user = await User.create({
                email: req.body.email,
                password: hashPassword,
                pseudo: req.body.pseudo,
            })
                .then((user) => {
                    /* Ajout du role par defaut*/
                    user.addRole(gameMasterRole)
                    user.addSalle(salleGenerale)
                    user.addSalle(req.body.Salles)

                    const token = jwt.sign(
                        {
                            userId: user.id,
                            pseudo: user.pseudo,
                            role: gameMasterRole.name
                        },
                        privateKey,
                        { expiresIn: '24h' }
                    )

                    const message = `L'utilisateur ${user.email} a bien été enregistré.`
                    res.status(201).json({ message, token })
                })
                .catch(error => res.status(400).json({ error }))
        } catch (error) {
            console.log(error)
            const message = `L'utilisateur n'a pas pu être enregistré. Reessayez dans quelques instants.`
            res.status(400).json({ error, message })
        }
    } else {
        const message = `L'adresse email ${req.body.email} n'est pas autorisée.`
        res.status(403).json({ message })
    }
}


exports.getUsers = (req, res) => {
    User.findAll({
        include: [
            { model: Salle },
            { model: Role }
        ]
    })
        .then(users => {
            const message = `Liste des users : `;
            const messageListeVide = `La liste des users est vide`;
            if (users.length === 0) {
                return res.status(200).json({ messageListeVide })
            } else {
                res.status(200).json({ message, data: users })
            }
        })
        .catch(error => res.status(400).json({ error }))
}

exports.getUser = (req, res) => {
    const id = req.params.id
    User.findOne({
        where: { id: id },
        include: [
            { model: Salle },
            { model: Role }
        ]

    })
        .then(user => {
            const message = `Le user ${user.pseudo} a bien été trouvée.`
            res.status(200).json({ message, data: user })
        })
        .catch(error => {
            const message = `Le user avec l'identifiant ${id} n'a pas pu être trouvé. Reessayez dans quelques instants.`
            res.status(500).json({ error })
        })
}

exports.updateUser = async (req, res) => {
    const id = req.params.id
    const password = req.body.password
    const user = await User.findByPk(id)
    /* Vérifie si le mot de passe du formulaire a été modifié */
    if (password) {
        const hashPassword = await bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                /* Si le mot de passe n'a pas été modifié, supprime le mot de passe de la requete */
                if (valid) {
                    delete req.body.password
                }
                else {
                    /* Si le mot de passe a été modifié, hache le nouveau mot de passe */
                    return bcrypt.hash(req.body.password, 10);
                }
            })
        req.body.password = hashPassword
    }

    if (req.file) {
        imageProfilURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        req.body.imageProfilURL = imageProfilURL
    }

    await User.update(req.body, { where: { id: id }, include: [{ model: Salle }, { model: Role }] })
        .then(() => {
            return User.findByPk(id).then(user => {
                if (user === null) {
                    const message = `Le user n'existe pas. Reessayez avec un autre identifiant.`
                    return res.status(404).json({ message })
                }
                if (req.body.Salles) {
                    user.addSalle(req.body.Salles)
                }
                if (req.body.Roles) {
                    user.addRole(req.body.Roles)
                }
                const message = `Le user ${user.pseudo} a bien été modifiée.`
                res.json({ message, data: user })
            })
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            /* Message d'erreur sur la contrainte d'unicité */
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = `Le user n'a pas pu être modifié. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}

exports.deleteUser = (req, res) => {
    const id = req.params.id
    User.findByPk(id)
        .then((user) => {
            if (user === null) {
                const message = `Le user n'existe pas. Reessayez avec un autre identifiant.`
                return res.status(404).json({ message })
            }
            const userDeleted = user;
            const filename = user.imageProfilURL.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                User.destroy({ where: { id: id } })
                    .then(() => {
                        const message = `Le user ${userDeleted.pseudo} a bien été supprimée.`
                        res.json({ message })
                    })
            })

        })
        .catch(error => {
            message = `Le user avec l'identifiant ${id} n'a pas pu être supprimée. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}

