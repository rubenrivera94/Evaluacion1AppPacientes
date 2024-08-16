const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { body } = require('express-validator');

const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

// Ruta para guardar un paciente
//// El método de guardar  debe llevar validación para los campos de rut, nombre, edad, sexo y enfermedad. Si uno o más de estos campos está vacío, entonces, no se podrá agregar un nuevo paciente.
router.post('/pacientes', [
    body('rut').not().isEmpty().withMessage('El RUT es obligatorio'),
    body('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
    body('edad').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('sexo').not().isEmpty().withMessage('El sexo es obligatorio'),
    body('enfermedad').not().isEmpty().withMessage('La enfermedad es obligatoria')
], pacienteController.guardarPaciente);

// Ruta para buscar pacientes por sexo, fecha de ingreso y enfermedad
router.get('/pacientes/buscar', pacienteController.buscarPacientes);

// Ruta para obtener todos los pacientes o un paciente por _id
router.get('/pacientes/:id?', pacienteController.listarPacientes);

// Ruta para actualizar un paciente
// El método de actualizar  debe llevar validación para los campos de rut, nombre, edad, sexo y enfermedad. Si uno o más de estos campos está vacío, entonces, no se podrá agregar un nuevo paciente.
router.put('/pacientes/:id', [
    body('rut').not().isEmpty().withMessage('El RUT es obligatorio'),
    body('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
    body('edad').isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),
    body('sexo').not().isEmpty().withMessage('El sexo es obligatorio'),
    body('enfermedad').not().isEmpty().withMessage('La enfermedad es obligatoria')
], pacienteController.actualizarPaciente);

// Ruta para eliminar (inhabilitar) un paciente
router.delete('/pacientes/:id', pacienteController.eliminarPaciente);


// Configuración del almacenamiento de archivos con Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Tipo de archivo no permitido'), false);
        }
        cb(null, true);
    }
});

// Nos aseguramos de que el directorio de carga exista
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Ruta para subir archivos
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha cargado ningún archivo' });
    }
    res.status(201).json({ fileName: req.file.filename });
});

// Ruta para obtener archivos
router.get('/upload/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Archivo no encontrado' });
        }
    });
});
module.exports = router;