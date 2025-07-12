// Archivo: src/api/instructor.rutas.js
const express = require('express');
const router = express.Router();
const instructorService = require('../services/instructor.servicio');

// --- RUTA PARA OBTENER TODOS LOS INSTRUCTORES ---
// GET /api/instructors
router.get('/', async (req, res) => {
  try {
    const instructores = await instructorService.obtenerTodos();
    res.status(200).json(instructores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- RUTA PARA CREAR UN NUEVO INSTRUCTOR ---
// POST /api/instructors
router.post('/', async (req, res) => {
  try {
    // req.body contiene los datos enviados en el cuerpo de la petición (ej. { nombre: "Juan Perez", biografia: "..." })
    const nuevoInstructor = await instructorService.crearInstructor(req.body);
    res.status(201).json(nuevoInstructor); // 201 significa "Creado"
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- RUTA PARA OBTENER UN INSTRUCTOR POR ID ---
// GET /api/instructors/:id
router.get('/:id', async (req, res) => {
  try {
    const instructor = await instructorService.obtenerPorId(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor no encontrado' });
    }
    res.status(200).json(instructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- RUTA PARA ACTUALIZAR UN INSTRUCTOR ---
// PUT /api/instructors/:id
router.put('/:id', async (req, res) => {
  try {
    // req.params.id contiene el ID que viene en la URL
    // req.body contiene los datos enviados en el cuerpo de la petición
    const instructorActualizado = await instructorService.actualizarInstructor(req.params.id, req.body);
    res.status(200).json(instructorActualizado);
  } catch (error) {
    // Si el servicio lanza un error (ej. "Instructor no encontrado"), lo atrapamos aquí.
    if (error.message === 'Instructor no encontrado') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// --- RUTA PARA ELIMINAR UN INSTRUCTOR ---
// DELETE /api/instructors/:id
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await instructorService.eliminarInstructor(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    // Atrapamos los errores específicos de la regla de negocio o de no encontrado
    if (error.message === 'Instructor no encontrado') {
      res.status(404).json({ message: error.message });
    } else {
      // Este será el error de "No se puede eliminar un instructor con cursos publicados"
      res.status(400).json({ message: error.message }); // 400 significa "Bad Request"
    }
  }
});

module.exports = router;