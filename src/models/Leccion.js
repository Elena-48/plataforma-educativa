module.exports = (sequelize, DataTypes) => {
  const Leccion = sequelize.define('Leccion', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT
    },
    moduloId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Lecciones',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return Leccion;
};