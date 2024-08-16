const Paciente = require('../models/Paciente');
const { validationResult } = require('express-validator');

// El método de guardar  debe llevar validación para los campos de rut, nombre, edad, sexo y enfermedad. Si uno o más de estos campos está vacío, entonces, no se podrá agregar un nuevo paciente.

exports.guardarPaciente = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const paciente = new Paciente(req.body);
        await paciente.save();
        res.status(201).json(paciente);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};

// Método para obtener todos los pacientes o un paciente por _id
exports.listarPacientes = async (req, res) => {
    try {
        const { id } = req.params;  // Obtiene el _id del paciente si está presente en los parámetros de la URL

        let pacientes;

        if (id) {
            // Si el _id está presente, busca al paciente por su _id
            pacientes = await Paciente.findById(id);

            if (!pacientes) {
                return res.status(404).json({ msg: 'Paciente no encontrado' });
            }
        } else {
            // Si no se proporciona _id, devuelve todos los pacientes
            pacientes = await Paciente.find();
        }

        res.json(pacientes);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};


// Método para actualizar un paciente
exports.actualizarPaciente = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        let paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente no encontrado' });
        }

        // Actualizar los campos del paciente
        paciente = await Paciente.findByIdAndUpdate(id, req.body, { new: true });

        res.json(paciente);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};

// Método para eliminar (inhabilitar) un paciente
exports.eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        let paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ msg: 'Paciente no encontrado' });
        }

        // Marcar el paciente como inhabilitado
        paciente = await Paciente.findByIdAndUpdate(id, { revisado: false }, { new: true });

        res.json({ msg: 'Paciente inhabilitado', paciente });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};

// Método para realizar una búsqueda personalizada de pacientes
//El método de búsqueda personalizada debe permitir buscar por sexo, fechaIngreso y enfermedad.
exports.buscarPacientes = async (req, res) => {
    try {
        // Extrae los parámetros de búsqueda de la consulta (query)
        const { sexo, fechaIngreso, enfermedad } = req.query;
        // Crea un objeto para construir la consulta de búsqueda
        const query = {};
        // Si se proporciona el parámetro 'sexo', agregarlo al objeto de consulta
        if (sexo) query.sexo = sexo;
        // Si se proporciona el parámetro 'fechaIngreso', buscar pacientes ingresados desde esa fecha
        if (fechaIngreso) query.fechaIngreso = { $gte: new Date(fechaIngreso) };
        // Si se proporciona el parámetro 'enfermedad', agregarlo al objeto de consulta
        if (enfermedad) query.enfermedad = enfermedad;
        // Realizar la búsqueda en la base de datos con los criterios construidos
        const pacientes = await Paciente.find(query);
        // Enviar la lista de pacientes encontrados en la respuesta como JSON
        res.json(pacientes);
    } catch (error) {
        // Manejar errores de servidor y enviar una respuesta de error
        res.status(500).send('Error en el servidor');
    }
};
