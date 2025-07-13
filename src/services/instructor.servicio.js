// src/services/instructor.servicio.js
const { Instructor, Curso } = require('../models'); // Asegúrate de que Curso esté importado si lo usas en este servicio

const instructorService = {};

instructorService.crearInstructor = async (datosDelInstructor) => {
  try {
    return await Instructor.create(datosDelInstructor);
  } catch (error) {
    console.error('Error en servicio crearInstructor:', error);
    throw error; // Re-lanza el error para que la ruta lo capture
  }
};

instructorService.obtenerTodos = async () => {
  try {
    return await Instructor.findAll();
  } catch (error) {
    console.error('Error en servicio obtenerTodos:', error);
    throw error;
  }
};

instructorService.obtenerPorId = async (id) => {
  try {
    return await Instructor.findByPk(id);
  } catch (error) {
    console.error(`Error en servicio obtenerPorId para ID ${id}:`, error);
    throw error;
  }
};

instructorService.actualizarInstructor = async (id, datosParaActualizar) => {
  try {
    const instructor = await instructorService.obtenerPorId(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado'); // Error personalizado
    }
    await instructor.update(datosParaActualizar);
    return instructor;
  } catch (error) {
    console.error(`Error en servicio actualizarInstructor para ID ${id}:`, error);
    throw error;
  }
};

instructorService.eliminarInstructor = async (id) => {
  try {
    const instructor = await instructorService.obtenerPorId(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado'); // Error personalizado
    }

    const cursosPublicados = await Curso.count({
      where: { instructorId: id, estaPublicado: true },
    });

    if (cursosPublicados > 0) {
      throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.'); // Error de regla de negocio
    }

    await instructor.destroy();
    return { mensaje: 'Instructor eliminado correctamente' };
  } catch (error) {
    console.error(`Error en servicio eliminarInstructor para ID ${id}:`, error);
    throw error;
  }
};

module.exports = instructorService;