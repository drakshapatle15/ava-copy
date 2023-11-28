const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PersonaSchema = Schema({
    name: {
        type: String,
        default: "Ava",
        required: false,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    instruction: {
        type: String,
        required: true,
    },
    imgURL: {
        type: String,
        required: true,
    },

}, { timestamps: true })

const Persona = mongoose.model('Persona', PersonaSchema)

module.exports = {Persona, PersonaSchema}