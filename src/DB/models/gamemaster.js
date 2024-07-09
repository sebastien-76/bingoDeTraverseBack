/* Création du modèle Gamemaster */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Gamemaster', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
    })
}