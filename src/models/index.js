// src/models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Instructor = require('./Instructor')(sequelize, DataTypes);
db.Curso = require('./Curso')(sequelize, DataTypes);
db.Modulo = require('./Modulo')(sequelize, DataTypes);
db.Leccion = require('./Leccion')(sequelize, DataTypes);

// --- Definimos las relaciones ---
db.Instructor.hasMany(db.Curso, { foreignKey: 'instructorId' });
db.Curso.belongsTo(db.Instructor, { foreignKey: 'instructorId' });

db.Curso.hasMany(db.Modulo, { foreignKey: 'cursoId' });
db.Modulo.belongsTo(db.Curso, { foreignKey: 'cursoId' });

db.Modulo.hasMany(db.Leccion, { foreignKey: 'moduloId' });
db.Leccion.belongsTo(db.Modulo, { foreignKey: 'moduloId' });

db.sequelize = sequelize;

module.exports = db;