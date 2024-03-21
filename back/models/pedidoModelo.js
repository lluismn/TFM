import mongoose from "mongoose";

// Esquema
const pedidoEsquema = new mongoose.Schema(
    {
        pedidoItems: [
            {
                nombre: { type: String, required: true },
                slug: { type: String, required: true },
                quantity: { type: Number, required: true },
                imagen: { type: String, required: true },
                precio: { type: Number, required: true },
                producto: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Producto',
                    required: true
                }
            }
        ],
        envio: {
            nombreCompleto: { type: String, required: true }, 
            direccion: { type: String, required: true },
            ciudad: { type: String, required: true }, 
            codigoPostal: { type: String, required: true },
            pais: { type: String, required: true }
        },
        metodoPago: { type: String, required: true },
        pagoResultado: {
            id: String,
            status: String,
            update_time: String,
            direccion_email: String,
        },
        precioItems: { type: Number, required: true },
        precioEnvio: { type: Number, required: true },
        precioImpuestos: { type: Number, required: true },
        totalPrecio: { type: Number, required: true },
        usuario: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario' ,
            required: true
        },
        estaPagado: { type: Boolean, default: false },
        pagadoA: { type: Date },
        estaEnviado: { type: Boolean, default: false },
        enviadoA: { type: Date },
    },
    {
        timestamps: true
    }
);

// Modelo
const Pedido = mongoose.model('Pedido', pedidoEsquema);

export default Pedido;