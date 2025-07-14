module.exports = (sequelize, DataTypes) => {
  const Modulo = sequelize.define('Modulo', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cursoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Modulos',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return Modulo;
};