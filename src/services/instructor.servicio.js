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

// Este es SOLO el fragmento de la función eliminarInstructor.
// Asegúrate de que el resto del archivo instructor.servicio.js esté como te lo di previamente.

instructorService.eliminarInstructor = async (id) => {
  try {
    // Primero, verifica si el instructor existe
    const instructor = await instructorService.obtenerPorId(id);
    if (!instructor) {
      throw new Error('Instructor no encontrado'); // Si no existe, lanza un error 404
    }

    // --- Parte CRÍTICA: Verificar cursos publicados ---
    // Contamos cuántos cursos tiene este instructor que están marcados como 'publicados'
    const cursosPublicadosAsociados = await Curso.count({
      where: {
        instructorId: id, // El ID del instructor que queremos eliminar
        estaPublicado: true // La condición de que el curso esté publicado
      }
      // Puedes descomentar la siguiente línea para ver la consulta SQL en los logs de Render
      // , logging: console.log
    });

    // Este log es crucial para la depuración en Render
    console.log(`Instructor ID ${id} tiene ${cursosPublicadosAsociados} cursos publicados.`);

    // Si el conteo es mayor que 0, significa que tiene cursos públicos y no se puede eliminar
    if (cursosPublicadosAsociados > 0) {
      throw new Error('No se puede eliminar un instructor que aún tiene cursos publicados.'); // Lanza el error de regla de negocio
    }
    // ----------------------------------------------------

    // Si no tiene cursos publicados, procede con la eliminación del instructor
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