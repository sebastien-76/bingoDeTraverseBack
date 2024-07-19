const { Salle } = require('../DB/sequelize');

exports.createSalle = (req, res) => {
    const user = req.body.user
    Salle.create(req.body)
        .then((salle) => {
            const message = `La salle "${req.body.name}" a été enregistrée`;
            res.status(201).json({ message })
            salle.addUsers(user)
        })
        .catch(error => res.status(400).json({ error }))
}

exports.getSalles = (req, res) => {
    Salle.findAll()
        .then(salles => {
            const message = `Liste des salles : `;
            const messageListeVide = `La liste des salles est vide`;
            if (salles.length === 0) {
                return res.status(200).json({ messageListeVide })
            } else {
            res.status(200).json({ message, data: salles })
        }})
        .catch(error => res.status(400).json({ error }))
}

exports.getSalle = (req, res) => {
    const id = req.params.id
    Salle.findByPk(id)
        .then(salle => {
            const message = `La salle ${salle.name} a bien été trouvée.`
            res.status(200).json({ message })
        })
        .catch(error => {
            const message = `La salle avec l'identifiant ${id} n'a pas pu être trouvé. Reessayez dans quelques instants.`
            res.status(500).json({ error })})
}

exports.updateSalle = (req, res) => {
    const id = req.params.id
    Salle.update(req.body, { where: { id: id } })
        .then(() => {
            return Salle.findByPk(id).then(salle => {
                if (salle === null) {
                    const message = `La salle n'existe pas. Reessayez avec un autre identifiant.`
                    return res.status(404).json({ message })
                }
                const message = `La salle ${salle.name} a bien été modifiée.`
                res.json({ message, data: salle })
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
            const message = `La salle n'a pas pu être modifié. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })
        })
}

exports.deleteSalle = (req, res) => {
    const id = req.params.id
    Salle.findByPk(id)
        .then((salle) => {
            if (salle === null) {
                const message = `La salle n'existe pas. Reessayez avec un autre identifiant.`
                return res.status(404).json({ message })
            }
            const salleDeleted = salle
            Salle.destroy({ where: { id: id } })
                .then(() => {
                    const message = `La salle ${salleDeleted.name} a bien été supprimée.`
                    res.json({ message })
                })
        })
        .catch(error => {
            message = `La salle avec l'identifiant ${id} n'a pas pu être supprimée. Reessayez dans quelques instants.`
            res.status(500).json({ message, data: error })})
}