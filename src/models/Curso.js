module.exports = (sequelize, DataTypes) => {
  const Curso = sequelize.define('Curso', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    estaPublicado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Cursos',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return Curso;
};