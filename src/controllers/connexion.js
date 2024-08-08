const { User } = require('../DB/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../Middleware/auth/private_key');

exports.signin = (req, res) => {
    User.findOne({ where: { email: req.body.email } })
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
                        const message = `Le mot de passe est incorrect.`
                        return res.status(401).json({ message })
                    }

                    /* Si le mot de passe est correct, on renvoie un token */
                    const token = jwt.sign(
                        { userId: user.id },
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