// Archivo: src/api/cursos.rutas.js
const express = require('express');
const router = express.Router();
// Este archivo ahora solo necesita importar el servicio
const cursoService = require('../services/curso.servicio');

// --- RUTAS DEL CRUD DE CURSOS ---

router.get('/', async (req, res) => {
  try {
    const cursos = await cursoService.obtenerTodosLosCursos();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const curso = await cursoService.obtenerCursoPorId(req.params.id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
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

router.put('/:id', async (req, res) => {
  try {
    const curso = await cursoService.actualizarCurso(req.params.id, req.body);
    res.status(200).json(curso);
  } catch (error) {
    res.status(404).json({ error: error.message }); // El servicio arroja 'Curso no encontrado'
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const resultado = await cursoService.eliminarCurso(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// --- RUTAS DE LÓGICA DE NEGOCIO ---

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

router.put('/:cursoId/publicar', async (req, res) => {
  try {
    const cursoPublicado = await cursoService.publicarCurso(req.params.cursoId);
    res.status(200).json(cursoPublicado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


module.exports = router;