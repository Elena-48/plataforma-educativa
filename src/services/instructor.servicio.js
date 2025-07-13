// src/services/instructor.servicio.js
// src/services/instructor.servicio.js
const { Instructor, Curso } = require('../models'); // Asegúrate de que Curso esté importado si lo usas en este servicio

const instructorService = {};

instructorService.crearInstructor = async (datosDelInstructor) => {
  return Instructor.create(datosDelInstructor);
};

instructorService.obtenerTodos = async () => {
  return Instructor.findAll();
};

// Esta es la ÚNICA definición necesaria para obtenerPorId
instructorService.obtenerPorId = async (id) => {
  return Instructor.findByPk(id);
};

instructorService.actualizarInstructor = async (id, datosParaActualizar) => {
  const instructor = await instructorService.obtenerPorId(id);
  if (!instructor) throw new Error('Instructor no encontrado'); // Esta línea arroja el error 404
  await instructor.update(datosParaActualizar);
  return instructor;
};

instructorService.eliminarInstructor = async (id) => {
  const instructor = await instructorService.obtenerPorId(id);
  if (!instructor) throw new Error('Instructor no encontrado'); // Esta línea arroja el error 404 si no se encuentra

  const cursosPublicados = await Curso.count({
    where: { instructorId: id, estaPublicado: true },
  });

  if (cursosPublicados > 0) {
    throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.');
  }

  await instructor.destroy();
  return { mensaje: 'Instructor eliminado correctamente' };
};

module.exports = instructorService;