/* Import du modele User */
const { User } = require('../DB/sequelize');
const { Role } = require('../DB/sequelize');

/* Import ValidationError et UniqueConstraintError de sequelize */
const { ValidationError, UniqueConstraintError } = require('sequelize')

/* Import du paquet bcrypt */
const bcrypt = require('bcrypt');

/* Export de la fonction création du user */
exports.signUp = async (req, res) => {

    /* Hashage du mot de passe */
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const gameMasterRole = await Role.findOne({ where: { name: 'GAMEMASTER' } })


    const user = await User.create({
        email: req.body.email,
        password: hashPassword,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        pseudo: req.body.pseudo
    })
        .then((user) => {
            /* Ajout du role par defaut*/
            user.addRole(gameMasterRole)
            const message = `L'utilisateur ${user.pseudo} a bien été enregistré.`
            res.status(201).json({ message, data: user })
        })
        .catch(error => res.status(400).json({ error }))
}

exports.getUsers = (req, res) => {
    User.findAll()
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
    User.findByPk(id)
        .then(user => {
            const message = `Le user ${user.pseudo} a bien été trouvée.`
            res.status(200).json({ message, data: user })
        })
        .catch(error => {
            const message = `Le user avec l'identifiant ${id} n'a pas pu être trouvé. Reessayez dans quelques instants.`
            res.status(500).json({ error })
        })
}

exports.updateUser = (req, res) => {
    const id = req.params.id
    User.update(req.body, { where: { id: id } })
        .then(() => {
            return User.findByPk(id).then(user => {
                if (user === null) {
                    const message = `Le user n'existe pas. Reessayez avec un autre identifiant.`
                    return res.status(404).json({ message })
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
            const userDeleted = user
            User.destroy({ where: { id: id } })
                .then(() => {
                    const message = `Le user ${userDeleted.pseudo} a bien été supprimée.`
                    res.json({ message })
                })
        })
        .catch(error => {
            message = `Le user avec l'identifiant ${id} n'a pas pu être supprimée. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}

