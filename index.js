const express = require('express'); // Importa Express para crear el servidor HTTP
const mongoose = require('mongoose'); // Importa Mongoose para la conexión con MongoDB
const cors = require('cors'); // Importa CORS para gestionar peticiones cruzadas
const pacienteRoutes = require('./routes/pacienteRoutes'); // Importa las rutas para los pacientes

const app = express(); // Crea una instancia de la aplicación Express
const port = 3000; // Asigna puerto en el que el servidor escuchará

app.use(cors()); // Habilita CORS para permitir solicitudes desde diferentes orígenes
app.use(express.json()); // Middleware para analizar cuerpos de solicitudes en formato JSON
app.use(express.urlencoded({ extended: true })); // Middleware para analizar cuerpos de solicitudes con datos codificados en URL

app.use('/api', pacienteRoutes); // Asocia las rutas de pacientes bajo el prefijo /api

// Conexión a MongoDB
mongoose.connect('mongodb+srv://rubenarb94:zaQjfZXRV59hHk0U@clusterprojectatlas.dcprijn.mongodb.net/?retryWrites=true&w=majority&appName=ClusterProjectAtlas', {
    autoIndex: true
}).then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}).catch(err => console.log(err));