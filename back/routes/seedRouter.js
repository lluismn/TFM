import express from 'express';
import Producto from "../models/productoModelo.js";
import data from "../data.js";
import Usuario from '../models/usuarioModelo.js';

// Definimos las rutas de las apis
const seedRouter = express.Router();
// TODO La función debería ser .remove, pero da error, buscar solución
seedRouter.get('/', async (req, res) => {
    // Quitamos todos los datos que hayan almacenados
    await Producto.deleteMany({});
    // Introducimos todos los datos en el archivo de data
    const productosCreados = await Producto.insertMany(data.productos);

    await Usuario.deleteMany({});
    const usuariosCreados = await Usuario.insertMany(data.usuarios);
    // Enviamos los datos al front
    res.send({ productosCreados, usuariosCreados })
});

export default seedRouter;