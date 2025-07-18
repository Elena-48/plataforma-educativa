const express = require('express');
const cors = require('cors');
const db = require('./models');
const instructorRoutes = require('./api/instructor.rutas.js');
const cursoRoutes = require('./api/cursos.rutas.js'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000; // Usa 10000 si Render lo detecta por defecto, o 3000 si es tu preferencia

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rutas ---
app.get('/', (req, res) => { 
  res.send('¡El servidor de la plataforma educativa está funcionando!');
});

app.use('/api/instructors', instructorRoutes); // <--- ¡ESTA LÍNEA ES IMPORTANTE PARA INSTRUCTORES!
app.use('/api/cursos', cursoRoutes); // <--- ESTA LÍNEA ES IMPORTANTE PARA CURSOS


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