const { Phrase } = require('../DB/sequelize');

exports.createPhrase = (req, res) => {
    Phrase.create(req.body)
        .then(() => {
            const message = `La phrase "${req.body.text}" a été enregistrée`;
            res.status(201).json({ message })
        })
        .catch(error => res.status(400).json({ error }))
}

exports.getPhrases = (req, res) => {
    Phrase.findAll()
        .then(phrases => {
            const message = `Liste des phrases : `;
            const messageListeVide = `La liste des phrases est vide`;
            if (phrases.length === 0) {
                return res.status(200).json({ messageListeVide })
            } else {
            res.status(200).json({ message, data: phrases })
        }})
        .catch(error => res.status(400).json({ error }))
}

exports.getPhrase = (req, res) => {
    const id = req.params.id
    Phrase.findByPk(id)
        .then(phrase => {
            const message = `La phrase ${phrase.text} a bien été trouvée.`
            res.status(200).json({ message })
        })
        .catch(error => {
            const message = `La phrase avec l'identifiant ${id} n'a pas pu être trouvé. Reessayez dans quelques instants.`
            res.status(500).json({ error })})
}

exports.updatePhrase = (req, res) => {
    const id = req.params.id
    Phrase.update(req.body, { where: { id: id } })
        .then(() => {
            return Phrase.findByPk(id).then(phrase => {
                if (phrase === null) {
                    const message = `La phrase n'existe pas. Reessayez avec un autre identifiant.`
                    return res.status(404).json({ message })
                }
                const message = `La phrase ${phrase.text} a bien été modifiée.`
                res.json({ message, data: phrase })
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
            const message = `La phrase n'a pas pu être modifié. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}

exports.deletePhrase = (req, res) => {
    const id = req.params.id
    Phrase.findByPk(id)
        .then((phrase) => {
            if (phrase === null) {
                const message = `La phrase n'existe pas. Reessayez avec un autre identifiant.`
                return res.status(404).json({ message })
            }
            const phraseDeleted = phrase
            Phrase.destroy({ where: { id: id } })
                .then(() => {
                    const message = `La phrase ${phraseDeleted.text} a bien été supprimée.`
                    res.json({ message })
                })
        })
        .catch(error => {
            message = `La phrase avec l'identifiant ${id} n'a pas pu être supprimée. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })})
}