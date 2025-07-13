// src/api/instructor.routes.js
const express = require('express');
const router = express.Router();
const instructorService = require('../services/instructor.servicio');

router.get('/', async (req, res) => {
  try {
    const instructores = await instructorService.obtenerTodos();
    res.status(200).json(instructores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoInstructor = await instructorService.crearInstructor(req.body);
    res.status(201).json(nuevoInstructor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const instructor = await instructorService.actualizarInstructor(req.params.id, req.body);
    res.status(200).json(instructor);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const resultado = await instructorService.eliminarInstructor(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    const statusCode = error.message.includes('encontrado') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

module.exports = router;