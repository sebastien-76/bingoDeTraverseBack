const { Gamemaster } = require('../DB/sequelize');

exports.createGamemaster = (req, res) => {
    Gamemaster.create(req.body)
        .then(() => {
            const message = `Le gamemaster "${req.body.email}" a été enregistré`;
            res.status(201).json({ message })
        })
        .catch(error => res.status(400).json({ error }))
}

exports.getGamemasters = (req, res) => {
    Gamemaster.findAll()
        .then(gamemasters => {
            const message = `Liste des gamemasters : `;
            const messageListeVide = `La liste des gamemasters est vide`;
            if (gamemasters.length === 0) {
                return res.status(200).json({ messageListeVide })
            } else {
            res.status(200).json({ message, data: gamemasters })
        }})
        .catch(error => res.status(400).json({ error }))
}

exports.getGamemaster = (req, res) => {
    const id = req.params.id
    Gamemaster.findByPk(id)
        .then(gamemaster => {
            const message = `Le gamemaster ${gamemaster.email} a bien été trouvé.`
            res.status(200).json({ message })
        })
        .catch(error => {
            const message = `Le gamemaster avec l'identifiant ${id} n'a pas pu être trouvé. Reessayez dans quelques instants.`
            res.status(500).json({ error })})
}

exports.updateGamemaster = (req, res) => {
    const id = req.params.id
    Gamemaster.update(req.body, { where: { id: id } })
        .then(() => {
            return Gamemaster.findByPk(id).then(gamemaster => {
                if (gamemaster === null) {
                    const message = `Le gamemaster n'existe pas. Reessayez avec un autre identifiant.`
                    return res.status(404).json({ message })
                }
                const message = `Le gamemaster ${gamemaster.email} a bien été modifié.`
                res.json({ message, data: gamemaster })
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
            const message = `e gamemaster n'a pas pu être modifié. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}

exports.deleteGamemaster = (req, res) => {
    const id = req.params.id
    Gamemaster.findByPk(id)
        .then((gamemaster) => {gamemaster
            if (gamemaster === null) {
                const message = `Le gamemaster n'existe pas. Reessayez avec un autre identifiant.`
                return res.status(404).json({ message })
            }
            const gamemasterDeleted = gamemaster
            Gamemaster.destroy({ where: { id: id } })
                .then(() => {
                    const message = `Le gamemaster ${gamemasterDeleted.email} a bien été supprimé.`
                    res.json({ message })
                })
        })
        .catch(error => {
            message = `Le gamemaster avec l'identifiant ${id} n'a pas pu être supprimé. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })})
}