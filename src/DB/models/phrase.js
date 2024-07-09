/* Création du modèle Phrase */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Phrase', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.STRING
        }
    })
}