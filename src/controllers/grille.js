const user = require('../DB/models/user');
const { Grille, Phrase, User, Salle } = require('../DB/sequelize');
const { getUser } = require('./user');
const { notifyParticipants } = require('../Middleware/mailer');
const { Op } = require('sequelize');

// Créer une nouvelle grille pour un utilisateur spécifique
exports.createGrille = async (req, res) => {
    const UserId = req.params.userId;
    try {
        // Vérifier si l'utilisateur a déjà une grille en cours
        const existingGrille = await Grille.findOne({ where: { UserId, finished: false } });
        if (existingGrille) {
            return res.status(200).json({
                message: 'Grille en cours trouvée',
                data: existingGrille
            });
        }

        // Charger les phrases de la base de données
        const phrases = await Phrase.findAll();

        // recuperer les info de l'utilisateur
        const userPlayer = await User.findOne({
            where: { id: UserId },
            include: [Salle]
        });

        // Charger les salles de l'utilisateur
        const sallesUser = userPlayer.Salles;

        // recuperer les id des salles
        const sallesIds = sallesUser.map((salle) => salle.dataValues.id);

        // Filtrer les phrases en fonction des salles de l'utilisateur
        const filteredPhrases = phrases.filter((phrase) => sallesIds.includes(phrase.SalleId));

        // Sélectionner aléatoirement 25 phrases
        const selectedPhrases = filteredPhrases.sort(() => Math.random() - 0.5).slice(0, 25);

        // Créer les cases de la grille avec les IDs des phrases sélectionnées
        const caseGrille = selectedPhrases.map((phrase) => ({
            phraseId: phrase.id
        }));

        // Enregistrer la grille dans la base de données
        const grille = await Grille.create({
            case: caseGrille,
            UserId,
            validatedCases: Array(25).fill(false) // Initialiser avec un tableau de 25 false
        });

        // Envoyer la grille et les phrases sélectionnées au frontend
        res.status(201).json({
            message: 'La grille a bien été créée',
            data: {
                grille,
                selectedPhrases
            }
        });
    } catch (error) {
        console.error("Erreur lors de la création de la grille :", error);
        res.status(500).json({ error: "La grille n'a pas pu être créée." });
    }
};

// Récupérer la grille en cours d'un utilisateur spécifique
exports.getGrilleByUser = async (req, res) => {
    const UserId = req.params.userId;
    try {
        const grille = await Grille.findOne({ where: { UserId, finished: false } });
        if (!grille) {
            return res.status(404).json({ error: 'Grille non trouvée' });
        }
        // Charger les phrases de la grille
        const phrases = await Phrase.findAll({ where: { id: grille.case.map(c => c.phraseId) } });
        const phrasesIds = phrases.map(p => p.id);

        // Vérifier les phrases manquantes
        const validatedCases = grille.validatedCases.map((isValid, index) => {
            if (isValid) return true;
            const phraseExists = phrasesIds.includes(grille.case[index].phraseId);
            return !phraseExists;
        });

        // Mettre à jour la grille si nécessaire
        if (validatedCases.includes(true)) {
            grille.validatedCases = validatedCases;
            await grille.save();
        }

        res.status(200).json({ message: 'La grille a bien été trouvée', data: grille });
    } catch (error) {
        console.error("Erreur lors de la récupération de la grille :", error);
        res.status(500).json({ error: 'La grille n\'a pas pu être trouvée.' });
    }
};

// Récupérer une grille par ID
exports.getGrilleById = async (req, res) => {
    const id = req.params.id;
    try {
        const grille = await Grille.findByPk(id);
        if (!grille) {
            return res.status(404).json({ error: 'Grille non trouvée' });
        }
        res.status(200).json({ message: 'La grille a bien été trouvée', data: grille });
    } catch (error) {
        console.error("Erreur lors de la récupération de la grille :", error);
        res.status(500).json({ error: 'La grille n\'a pas pu être trouvée.' });
    }
};

exports.updateGrille = async (req, res) => {
    const id = req.params.id;
    const { validatedCases } = req.body;

    try {
        const grille = await Grille.findByPk(id);
        if (!grille) {
            return res.status(404).json({ error: 'Grille non trouvée' });
        }

        grille.validatedCases = validatedCases;

        // Vérification si la grille est terminée
        grille.finished = false;
        for (let i = 0; i < 5; i++) {
            if (
                grille.validatedCases[i * 5] && grille.validatedCases[i * 5 + 1] &&
                grille.validatedCases[i * 5 + 2] && grille.validatedCases[i * 5 + 3] &&
                grille.validatedCases[i * 5 + 4]
            ) {
                grille.finished = true;
                break;
            }
            if (
                grille.validatedCases[i] && grille.validatedCases[i + 5] &&
                grille.validatedCases[i + 10] && grille.validatedCases[i + 15] &&
                grille.validatedCases[i + 20]
            ) {
                grille.finished = true;
                break;
            }
            if (
                grille.validatedCases[0] && grille.validatedCases[6] &&
                grille.validatedCases[12] && grille.validatedCases[18] &&
                grille.validatedCases[24]
            ) {
                grille.finished = true;
                break;
            }
            if (
                grille.validatedCases[4] && grille.validatedCases[8] &&
                grille.validatedCases[12] && grille.validatedCases[16] &&
                grille.validatedCases[20]
            ) {
                grille.finished = true;
                break;
            }
        }

        await grille.save();

        // Si la grille est terminée et que ce n'est pas le userTest qui a terminé la grille
        if (grille.finished) {
            const userTest = await User.findOne({ where: { email: 'test@gmail.com' } });

            if (grille.UserId !== userTest.id) {
                // Ajouter un point au user qui a fini la grille
                const user = await User.findByPk(grille.UserId);
                user.points += 1;
                await user.save();

                // Récupérer les e-mails des autres participants
                const participants = await User.findAll({
                    where: { id: { [Op.ne]: grille.UserId } }
                });
                const participantsEmails = participants.map(p => p.email);

                // Notifier les participants
                await notifyParticipants(user.pseudo, participantsEmails);

                // Supprimer toutes les autres grilles
                await Grille.destroy({
                    where: {}
                });
            }
        }

        return res.status(200).json({ message: 'La grille a bien été modifiée', data: grille });

    } catch (error) {
        console.error("Erreur lors de la modification de la grille :", error);
        return res.status(500).json({ error: 'La grille n\'a pas pu être modifiée.' });
    }
};