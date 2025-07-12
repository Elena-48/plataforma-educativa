// Archivo: src/services/instructor.servicio.js

// Importamos los modelos desde el archivo central de modelos (index.js)
const { Instructor, Curso } = require('../models');

// Creamos un objeto para agrupar nuestros servicios
const instructorService = {};

// --- Servicio para CREAR un nuevo instructor ---
instructorService.crearInstructor = async (datosDelInstructor) => {
  // Usamos el modelo Instructor y su método create()
  const nuevoInstructor = await Instructor.create(datosDelInstructor);
  return nuevoInstructor;
};

// --- Servicio para OBTENER TODOS los instructores ---
instructorService.obtenerTodos = async () => {
  const instructores = await Instructor.findAll();
  return instructores;
};

// --- Servicio para OBTENER UN instructor por su ID ---
instructorService.obtenerPorId = async (id) => {
  const instructor = await Instructor.findByPk(id);
  return instructor;
};

// --- Servicio para ACTUALIZAR un instructor por su ID ---
instructorService.actualizarInstructor = async (id, datosParaActualizar) => {
  const instructor = await instructorService.obtenerPorId(id);
  if (!instructor) {
    // Si el instructor no existe, lanzamos un error
    throw new Error('Instructor no encontrado');
  }
  // Si existe, lo actualizamos con los nuevos datos
  await instructor.update(datosParaActualizar);
  return instructor;
};

// --- Servicio para ELIMINAR un instructor por su ID (con regla de negocio) ---
instructorService.eliminarInstructor = async (id) => {
  const instructor = await instructorService.obtenerPorId(id);
  if (!instructor) {
    throw new Error('Instructor no encontrado');
  }

  // --- REGLA DE NEGOCIO CRÍTICA ---
  // Antes de eliminar, verificamos si tiene cursos publicados.
  const cursosPublicados = await Curso.count({
    where: {
      instructorId: id,
      estaPublicado: true,
    },
  });

  // Si el conteo es mayor a 0, lanzamos un error y no permitimos la eliminación.
  if (cursosPublicados > 0) {
    throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.');
  }

  // Si pasa la validación, eliminamos el instructor.
  await instructor.destroy();
  return { mensaje: 'Instructor eliminado correctamente' };
};


module.exports = instructorService;