const { User } = require('../DB/sequelize');
const { Role } = require('../DB/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../Middleware/auth/private_key');

exports.signin = (req, res) => {
    User.findOne({ where: { email: req.body.email }, include: [{model: Role, attributes:{exclude: ['Users_Roles']} }] })
        .then(user => {
            /* Verification de la presence de l'utilisateur dans la base de données */
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`
                return res.status(404).json(message)
            }
            /* Comparaison du mot de passe entré par l'utilisateur avec le mot de passe crypté */
            bcrypt.compare(req.body.password, user.password)
                .then(isPasswordValid => {
                    /* Verification du mot de passe */
                    if (!isPasswordValid) {
                        const message = `Email ou mot de passe incorrect, veuillez réessayer!`
                        return res.status(401).json({ message })
                    }

                    const role = user.Roles.map(role => role.name)

                    /* Si le mot de passe est correct, on renvoie un token */
                    const token = jwt.sign(
                        {
                            userId: user.id,
                            pseudo: user.pseudo,
                            role: role
                        },
                        privateKey,
                        { expiresIn: '24h' }
                    )
                    const message = `Connexion reussie.`
                    res.json({ message, data: user, token })
                })
        })
        .catch(error => {
            const message = `L'utilisateur n'a pas pu se connecter. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}