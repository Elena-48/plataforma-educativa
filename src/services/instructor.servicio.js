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
    const instructor = await instructorService.obtenerPorId(id); // Obtiene el instructor una sola vez
    if (!instructor) {
      throw new Error('Instructor no encontrado'); // Lanza error si no lo encuentra
    }

    // --- Parte CRÍTICA: Verificar cursos publicados ---
    const cursosPublicadosAsociados = await Curso.count({
      where: {
        instructorId: id,
        estaPublicado: true
      }
      // Puedes descomentar la siguiente línea para ver la consulta SQL en los logs de Render
      // , logging: console.log
    });

    console.log(`Instructor ID ${id} tiene ${cursosPublicadosAsociados} cursos publicados.`); // Log para depuración

    if (cursosPublicadosAsociados > 0) { // Si el conteo es mayor que 0, no permite la eliminación
      throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.');
    }
    // ----------------------------------------------------

    // Si no hay cursos publicados, procede a eliminar el instructor
    await instructor.destroy();
    return { mensaje: 'Instructor eliminado correctamente' };
  } catch (error) {
    // Si el error es uno de nuestros errores personalizados, lo relanzamos
    if (error.message === 'Instructor no encontrado' || error.message === 'No se puede eliminar un instructor que aún tiene cursos publicados.') {
      throw error;
    }
    // Para cualquier otro error inesperado
    console.error(`Error inesperado en eliminarInstructor para ID ${id}:`, error);
    throw new Error('Error interno del servidor al intentar eliminar el instructor.');
  }
};

module.exports = instructorService;