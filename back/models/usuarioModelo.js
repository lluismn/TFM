import mongoose from "mongoose";

// Esquema
const usuarioEsquema = new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        esAdmin: { type: Boolean, default: false , required: true },

    },
    {
        timestamps: true
    }
);

// Modelo
const Usuario = mongoose.model('Usuario', usuarioEsquema);

export default Usuario;