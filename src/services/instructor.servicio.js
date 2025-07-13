// src/services/instructor.servicio.js
const { Instructor, Curso } = require('../models');

const instructorService = {};

instructorService.crearInstructor = async (datosDelInstructor) => {
  return Instructor.create(datosDelInstructor);
};

instructorService.obtenerTodos = async () => {
  return Instructor.findAll();
};

instructorService.obtenerPorId = async (id) => {
  return Instructor.findByPk(id);
};

instructorService.actualizarInstructor = async (id, datosParaActualizar) => {
  const instructor = await instructorService.obtenerPorId(id);
  if (!instructor) throw new Error('Instructor no encontrado');
  await instructor.update(datosParaActualizar);
  return instructor;
};

instructorService.eliminarInstructor = async (id) => {
    const instructor = await instructorService.obtenerPorId(id);
    if (!instructor) throw new Error('Instructor no encontrado');

    const cursosPublicados = await Curso.count({ // Aquí se cuenta si hay cursos publicados
        where: { instructorId: id, estaPublicado: true },
    });

    if (cursosPublicados > 0) { // Si hay cursos publicados, se lanza el error
        throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.');
    }

    await instructor.destroy();
    return { mensaje: 'Instructor eliminado correctamente' };
};

module.exports = instructorService;