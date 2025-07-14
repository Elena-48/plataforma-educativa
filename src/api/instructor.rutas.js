const express = require('express');
const router = express.Router();
const instructorService = require('../services/instructor.servicio');
module.exports = router;
// Ruta para obtener todos los instructores
router.get('/', async (req, res) => {
  try {
    const instructores = await instructorService.obtenerTodos();
    res.status(200).json(instructores);
  } catch (error) {
    console.error('Error al obtener todos los instructores:', error); // Log para depuración
    res.status(500).json({ error: 'Error interno del servidor al obtener instructores.' });
  }
});

// Ruta para obtener un instructor específico por su ID
router.get('/:id', async (req, res) => {
  try {
    const instructor = await instructorService.obtenerPorId(req.params.id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor no encontrado.' });
    }
    res.status(200).json(instructor);
  } catch (error) {
    console.error(`Error al obtener instructor con ID ${req.params.id}:`, error); // Log para depuración
    res.status(500).json({ error: 'Error interno del servidor al obtener instructor por ID.' });
  }
});

// Ruta para crear un nuevo instructor
router.post('/', async (req, res) => {
  try {
    const nuevoInstructor = await instructorService.crearInstructor(req.body);
    res.status(201).json(nuevoInstructor);
  } catch (error) {
    console.error('Error al crear instructor:', error); // Log para depuración
    res.status(500).json({ error: 'Error interno del servidor al crear instructor.' });
  }
});

// Ruta para actualizar un instructor existente
router.put('/:id', async (req, res) => {
  try {
    const instructorActualizado = await instructorService.actualizarInstructor(req.params.id, req.body);
    res.status(200).json(instructorActualizado);
  } catch (error) {
    console.error(`Error al actualizar instructor con ID ${req.params.id}:`, error); // Log para depuración
    // Aquí el error puede ser 404 si no lo encuentra, o 500 si es otro tipo de error
    const statusCode = error.message.includes('encontrado') ? 404 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

// Ruta para eliminar un instructor
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await instructorService.eliminarInstructor(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al eliminar instructor con ID ${req.params.id}:`, error); // Log para depuración
    // Aquí el error puede ser 404 (no encontrado) o 400 (tiene cursos publicados)
    const statusCode = error.message.includes('encontrado') ? 404 : (error.message.includes('cursos publicados') ? 400 : 500);
    res.status(statusCode).json({ error: error.message });
  }
});

module.exports = router;