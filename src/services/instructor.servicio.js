// src/services/instructor.servicio.js
const { Instructor, Curso } = require('../models'); // Asegúrate que ambos modelos estén importados

const instructorService = {};

instructorService.crearInstructor = async (datosDelInstructor) => {
  try {
    return await Instructor.create(datosDelInstructor);
  } catch (error) {
    console.error('Error en servicio crearInstructor:', error);
    throw error;
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
      throw new Error('Instructor no encontrado');
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
      throw new Error('Instructor no encontrado');
    }

    // --- Parte CRÍTICA: Verificar cursos publicados ---
    const cursosPublicadosAsociados = await Curso.count({
      where: {
        instructorId: id,
        estaPublicado: true
      }
      // Si quieres ver la consulta SQL exacta en los logs de Render, descomenta la línea de abajo:
      // , logging: console.log
    });

    console.log(`Instructor ID ${id} tiene ${cursosPublicadosAsociados} cursos publicados.`); // Log para depuración

    if (cursosPublicadosAsociados > 0) {
      throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.');
    }
    // ----------------------------------------------------

    await instructor.destroy();
    return { mensaje: 'Instructor eliminado correctamente' };
  } catch (error) {
    // Si el error es uno de nuestros errores personalizados, lo relanzamos para que la ruta lo maneje
    if (error.message === 'Instructor no encontrado' || error.message === 'No se puede eliminar un instructor que aún tiene cursos publicados.') {
      throw error;
    }
    // Si es otro tipo de error (ej. de base de datos), lo loggeamos y lanzamos un error genérico 500
    console.error(`Error inesperado en eliminarInstructor para ID ${id}:`, error);
    throw new Error('Error interno del servidor al intentar eliminar el instructor.');
  }
};

module.exports = instructorService;