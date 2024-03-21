import mongoose from "mongoose";

// Esquema
const productoEsquema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        imagen: { type: String, required: true },
        marca: { type: String, required: true },
        categoria: { type: String, required: true },
        descripcion: { type: String, required: true },
        precio: { type: Number, required: true },
        numeroEnStock: { type: Number, required: true },
        valoracion: { type: Number, required: true },
        numReviews: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);

// Modelo
const Producto = mongoose.model('Producto', productoEsquema);

export default Producto;