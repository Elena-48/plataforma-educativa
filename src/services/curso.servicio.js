// Archivo: src/services/curso.servicio.js

// Importamos todos los modelos que necesitamos desde el index central
const { Curso, Modulo, Leccion, Instructor } = require('../models');

const cursoService = {};

// --- CRUD BÁSICO DE CURSOS ---

// Obtiene todos los cursos con sus módulos, lecciones e instructor
cursoService.obtenerTodosLosCursos = async () => {
  const cursos = await Curso.findAll({
    include: [
      { model: Instructor }, // Así se incluye el modelo directamente
      { model: Modulo, include: [Leccion] }
    ]
  });
  return cursos;
};

// Obtiene un curso específico por ID con todos sus detalles
cursoService.obtenerCursoPorId = async (id) => {
  const curso = await Curso.findByPk(id, {
    include: [
      { model: Instructor },
      { model: Modulo, include: [Leccion] }
    ]
  });
  return curso;
};

// Crea un nuevo curso
cursoService.crearCurso = async (datosDelCurso) => {
  const nuevoCurso = await Curso.create(datosDelCurso);
  return nuevoCurso;
};

// Actualiza un curso
cursoService.actualizarCurso = async (id, datosParaActualizar) => {
  const curso = await cursoService.obtenerCursoPorId(id);
  if (!curso) {
    throw new Error('Curso no encontrado');
  }
  //No djara modificar el curso si ya esta publicado 
  if (curso.estaPublicado) {
    throw new Error('No se puede modificar un curso que ya está publicado.');
  }

  // Aquí podríamos añadir lógica de negocio, ej: no permitir cambiar el instructorId si ya tiene módulos.
  await curso.update(datosParaActualizar);
  return curso;
};

// Elimina un curso
cursoService.eliminarCurso = async (id) => {
  const curso = await cursoService.obtenerCursoPorId(id);
  if (!curso) {
    throw new Error('Curso no encontrado');
  }
  await curso.destroy();
  return { message: 'Curso eliminado correctamente' };
};


// --- LÓGICA DE NEGOCIO ESPECÍFICA ---

// Agrega un módulo a un curso
cursoService.agregarModulo = async (cursoId, datosDelModulo) => {
  const curso = await Curso.findByPk(cursoId);
  if (!curso) {
    throw new Error('El curso especificado no existe.');
  }
  if (curso.estaPublicado) {
    throw new Error('No se pueden añadir módulos a un curso que ya está publicado.');
  }
  const nuevoModulo = await Modulo.create({ ...datosDelModulo, cursoId: cursoId });
  return nuevoModulo;
};

// Agrega una lección a un módulo
cursoService.agregarLeccion = async (moduloId, datosDeLaLeccion) => {
  const modulo = await Modulo.findByPk(moduloId, { include: [Curso] });
  if (!modulo) {
    throw new Error('El módulo especificado no existe.');
  }
  if (modulo.Curso.estaPublicado) {
    throw new Error('No se pueden añadir lecciones a un curso que ya está publicado.');
  }
  const nuevaLeccion = await Leccion.create({ ...datosDeLaLeccion, moduloId: moduloId });
  return nuevaLeccion;
};

// Publica un curso
cursoService.publicarCurso = async (cursoId) => {
  const curso = await Curso.findByPk(cursoId);
  if (!curso) {
    throw new Error('El curso especificado no existe.');
  }
  curso.estaPublicado = true;
  await curso.save();
  return curso;
};


module.exports = cursoService;