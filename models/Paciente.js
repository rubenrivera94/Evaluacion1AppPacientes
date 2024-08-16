const mongoose = require('mongoose');
const { Schema } = mongoose;

const pacienteSchema = new Schema({
    rut: { type: String, required: true },
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    sexo: { type: String, required: true },
    fotoPersonal: { type: String, default: '' },
    fechaIngreso: { type: Date, default: Date.now },//valor por defecto 
    enfermedad: { type: String, required: true },
    revisado: { type: Boolean, default: false }//valor por defecto
});

module.exports = mongoose.model('Paciente', pacienteSchema);
