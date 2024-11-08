const { User } = require('../DB/sequelize');
const { Role } = require('../DB/sequelize');
const { Gamemaster } = require('../DB/sequelize');
const { Salle } = require('../DB/sequelize');
const jwt = require('jsonwebtoken');
const privateKey = require('../Middleware/auth/private_key');
const fs = require('fs');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../Middleware/mailer');
const { Op } = require('sequelize');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Génération d'un token sécurisé
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Expire dans 1 heure
        await user.save();

        // Envoi de l'email de réinitialisation via la nouvelle fonction sendPasswordResetEmail
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: "E-mail de réinitialisation envoyé." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    console.log('Received Token:', token);

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // Hacher et sauvegarder le nouveau mot de passe
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        console.error('Error during password reset:', error);  // Ajoute un log d'erreur
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.signUp = async (req, res) => {
    const gamemasterMail = await Gamemaster.findOne({ where: { email: req.body.email } });

    if (gamemasterMail) {
        try {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const gamemasterRole = await Role.findOne({ where: { name: 'GAMEMASTER' } });
            const salleGenerale = await Salle.findOne({ where: { name: 'Générale' } });

            const user = await User.create({
                email: req.body.email,
                password: hashPassword,
                pseudo: req.body.pseudo,
            })
                .then((user) => {
                    user.addRole(gamemasterRole);
                    user.addSalle(salleGenerale);
                    user.addSalle(req.body.Salles);

                    const token = jwt.sign(
                        { userId: user.id, pseudo: user.pseudo, role: gamemasterRole.name },
                        privateKey,
                        { expiresIn: '24h' }
                    );

                    const message = `L'utilisateur ${user.email} a bien été enregistré.`;
                    res.status(201).json({ message, token });
                })
                .catch(error => res.status(400).json({ error }));
        } catch (error) {
            console.log(error);
            const message = `L'utilisateur n'a pas pu être enregistré. Réessayez dans quelques instants.`;
            res.status(400).json({ error, message });
        }
    } else {
        const message = `L'adresse email ${req.body.email} n'est pas autorisée.`;
        res.status(403).json({ message });
    }
};

exports.getUsers = (req, res) => {
    User.findAll({
        include: [{ model: Salle }, { model: Role }]
    })
        .then(users => {
            const message = users.length === 0 ? `La liste des users est vide` : `Liste des users :`;
            res.status(200).json({ message, data: users });
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getUser = (req, res) => {
    const id = req.params.id;
    User.findOne({
        where: { id: id },
        include: [{ model: Salle }, { model: Role }]
    })
        .then(user => {
            const message = `Le user ${user.pseudo} a bien été trouvé.`;
            res.status(200).json({ message, data: user });
        })
        .catch(error => {
            const message = `Le user avec l'identifiant ${id} n'a pas pu être trouvé. Réessayez dans quelques instants.`;
            res.status(500).json({ error });
        });
};

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const password = req.body.password;
    const user = await User.findByPk(id);

    if (password) {
        const hashPassword = await bcrypt.compare(req.body.password, user.password)
            .then(valid => valid ? null : bcrypt.hash(req.body.password, 10));
        req.body.password = hashPassword;
    }

    const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });

    if (req.file) {
        req.body.imageProfilURL = `https://${req.get('host')}/images/${req.file.filename}`;
    }

    await User.update(req.body, { where: { id: id }, include: [{ model: Salle }, { model: Role }] })
        .then(() => {
            return User.findByPk(id).then(user => {
                if (!user) {
                    const message = `Le user n'existe pas. Réessayez avec un autre identifiant.`;
                    return res.status(404).json({ message });
                }
                if (req.body.Salles) user.addSalle(req.body.Salles);
                if (req.body.Roles === 'ADMIN') user.addRole(adminRole);
                if (req.body.deletedRoles === 'ADMIN') user.removeRole(adminRole);

                const message = `Le user ${user.pseudo} a bien été modifié.`;
                res.json({ message, data: user });
            });
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message = `Le user n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
};

exports.deleteUser = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
        .then(user => {
            if (!user) {
                const message = `Le user n'existe pas. Réessayez avec un autre identifiant.`;
                return res.status(404).json({ message });
            }
            const userDeleted = user;
            const filename = user.imageProfilURL.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                User.destroy({ where: { id: id } })
                    .then(() => {
                        const message = `Le user ${userDeleted.pseudo} a bien été supprimé.`;
                        res.json({ message });
                    });
            });
        })
        .catch(error => {
            const message = `Le user avec l'identifiant ${id} n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
};
