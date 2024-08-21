/* Création du modèle User */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
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
            },
            unique: {
                msg: "Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre!"
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
        },
        firstname: {
            type: DataTypes.STRING,
        },
        pseudo: {
            type: DataTypes.STRING
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        imageProfilURL: {
            type: DataTypes.STRING
        }
    })
}