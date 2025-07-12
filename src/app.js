// src/app.js
const express = require('express');
const sequelize = require('./config/database');
const db = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Importamos las rutas de instructores
const instructorRoutes = require('./api/instructor.rutas');
const cursoRoutes = require('./api/cursos.rutas'); // Correcto

// Middleware para que Express pueda entender JSON
app.use(express.json());

// Le decimos a la app que use nuestras rutas
app.use('/api/instructors', instructorRoutes);
app.use('/api/cursos', cursoRoutes); // <-- LÍNEA CORREGIDA AQUÍ

// --- Por ahora, la ruta principal ---
app.get('/', (req, res) => {
  res.send('¡El servidor está vivo y funcionando!');
});

// Función para iniciar el servidor
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