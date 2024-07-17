/* Création du modèle Avatar */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Avatar', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        imageURL: {
            type: DataTypes.STRING
        }
    })
}