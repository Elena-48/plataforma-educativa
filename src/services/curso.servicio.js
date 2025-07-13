// src/services/curso.servicio.js
const { Curso, Modulo, Leccion, Instructor } = require('../models');

const cursoService = {};

// CRUD
cursoService.obtenerTodosLosCursos = async () => {
  return Curso.findAll({ include: [{ model: Instructor }, { model: Modulo, include: [Leccion] }] });
};
cursoService.obtenerCursoPorId = async (id) => {
  return Curso.findByPk(id, { include: [{ model: Instructor }, { model: Modulo, include: [Leccion] }] });
};
cursoService.crearCurso = async (datosDelCurso) => {
  return Curso.create(datosDelCurso);
};
cursoService.actualizarCurso = async (id, datosParaActualizar) => {
  const curso = await cursoService.obtenerCursoPorId(id);
  if (!curso) throw new Error('Curso no encontrado');
  if (curso.estaPublicado) throw new Error('No se puede modificar un curso que ya está publicado.');
  await curso.update(datosParaActualizar);
  return curso;
};
cursoService.eliminarCurso = async (id) => {
  const curso = await cursoService.obtenerCursoPorId(id);
  if (!curso) throw new Error('Curso no encontrado');
  await curso.destroy();
  return { message: 'Curso eliminado correctamente' };
};

// Lógica de negocio
cursoService.agregarModulo = async (cursoId, datosDelModulo) => {
  const curso = await Curso.findByPk(cursoId);
  if (!curso) throw new Error('El curso especificado no existe.');
  if (curso.estaPublicado) throw new Error('No se pueden añadir módulos a un curso que ya está publicado.');
  return Modulo.create({ ...datosDelModulo, cursoId: cursoId });
};
cursoService.agregarLeccion = async (moduloId, datosDeLaLeccion) => {
  const modulo = await Modulo.findByPk(moduloId, { include: [Curso] });
  if (!modulo) throw new Error('El módulo especificado no existe.');
  if (modulo.Curso.estaPublicado) throw new Error('No se pueden añadir lecciones a un curso que ya está publicado.');
  return Leccion.create({ ...datosDeLaLeccion, moduloId: moduloId });
};
cursoService.publicarCurso = async (cursoId) => {
  const curso = await Curso.findByPk(cursoId);
  if (!curso) throw new Error('El curso especificado no existe.');
  curso.estaPublicado = true;
  await curso.save();
  return curso;
};

module.exports = cursoService;