/* Création du modèle Phrase */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Salle', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}