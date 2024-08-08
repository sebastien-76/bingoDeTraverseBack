module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Grille', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    case: {
      type: DataTypes.JSON,
      allowNull: false
    },
    validatedCases: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: Array(25).fill(false)
    },
    finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});
};
