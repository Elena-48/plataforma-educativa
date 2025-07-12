// src/models/Instructor.js
module.exports = (sequelize, DataTypes) => {
  const Instructor = sequelize.define('Instructor', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    biografia: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'Instructores',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return Instructor;
};