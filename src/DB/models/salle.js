/* Création du modèle Phrase */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Salle', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom: {
            type: DataTypes.STRING
        }
    })
}