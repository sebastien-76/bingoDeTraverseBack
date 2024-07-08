/* Création du modèle User avec Sequelize */
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
                /* A modifier pour vérifier que l'adresse appartient à une adresse email de gamemaster */
                isEmail: true
            },
            unique: {
                msg: "Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre!"
            }
        },
        password: {
            type: DataTypes.STRING
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pseudo: {
            type: DataTypes.STRING
        }

    })
}