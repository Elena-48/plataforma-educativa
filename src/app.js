// src/app.js
const express = require('express');
const cors = require('cors');
const db = require('./models');
const instructorRoutes = require('./api/instructor.rutas.js');
const cursoRoutes = require('./api/cursos.rutas.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rutas ---
app.use('/api/instructors', instructorRoutes);
app.use('/api/cursos', cursoRoutes);

app.get('/', (req, res) => {
  res.send('¡El servidor de la plataforma educativa está funcionando!');
});

// --- Iniciar Servidor ---
async function startServer() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Conexión y modelos sincronizados con la base de datos.');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar y sincronizar la base de datos:', error);
  }
}

startServer();