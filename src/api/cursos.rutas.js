const express = require('express');
const router = express.Router();
const cursoService = require('../services/curso.servicio');

// Rutas para Cursos
router.get('/', async (req, res) => {
  try {
    const cursos = await cursoService.obtenerTodosLosCursos();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RUTA PARA OBTENER UN CURSO ESPECÍFICO POR SU ID
router.get('/:id', async (req, res) => {
  try {
    const curso = await cursoService.obtenerCursoPorId(req.params.id);
    if (!curso) {
      // Si el servicio no devuelve nada, enviamos un 404
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoCurso = await cursoService.crearCurso(req.body);
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Rutas para Módulos y Lecciones anidadas
router.post('/:cursoId/modulos', async (req, res) => {
  try {
    const nuevoModulo = await cursoService.agregarModulo(req.params.cursoId, req.body);
    res.status(201).json(nuevoModulo);
  } catch (error) {
    const statusCode = error.message.includes('existe') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

router.post('/:cursoId/modulos/:moduloId/lecciones', async (req, res) => {
  try {
    const nuevaLeccion = await cursoService.agregarLeccion(req.params.moduloId, req.body);
    res.status(201).json(nuevaLeccion);
  } catch (error) {
    const statusCode = error.message.includes('existe') ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

// Ruta para publicar
router.put('/:cursoId/publicar', async (req, res) => {
  try {
    const cursoPublicado = await cursoService.publicarCurso(req.params.cursoId);
    res.status(200).json(cursoPublicado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;