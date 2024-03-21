import express, { query } from 'express';
import Producto from '../models/productoModelo.js';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';

const productoRouter = express.Router();

productoRouter.get('/', async (req, res) => {
    // Traemos todos los productos
    const productos = await Producto.find();
    res.send(productos)
})

const PAGE_SIZE = data.productos.length;
productoRouter.get('/buscar',expressAsyncHandler(async (req, res) => {
    // Aplicamos los filtros
    const {query} = req;
    const paginaSize = query.paginaSize || PAGE_SIZE;
    const pagina = query.pagina || 1;
    const categoria = query.categoria || '';
    const marca = query.marca || '';
    const precio = query.precio || '';
    const valoracion = query.valoracion || '';
    const orden = query.orden || '';
    const buscarQuery = query.query || '';

    const queryFiltro =
        buscarQuery && buscarQuery !== 'all'
            ? {
                nombre: {
                    $regex: buscarQuery,
                    $options: "i",
                }
            }
            : {};
    
    const categoriaFiltro = categoria && categoria !== 'all' ? {categoria} : {};
    const valoracionFiltro = valoracion && valoracion !== 'all' 
        ? {
            valoracion: {
                $gte: Number(valoracion),
            }
        } : {};
    const precioFiltro = precio && precio !== 'all'
        ? {
            precio: {
                $gte: Number(precio.split('-')[0]),
                $lte: Number(precio.split('-')[1]),
            }
        } : {};
    const ordenar = orden === 'featured'
        ? { featured: -1}
        : orden === 'lowest'
        ? { precio: 1}
        : orden === 'highest'
        ? { precio: -1}
        : orden === 'toprated'
        ? { valoracion: -1}
        : orden === 'newest'
        ? { createdAt: -1}
        : { _id: -1 };


    const productos = await Producto.find(
        {...queryFiltro, ...categoriaFiltro, ...valoracionFiltro, ...precioFiltro}
    )
        .sort(ordenar)
        .skip(paginaSize * (pagina - 1))
        .limit(paginaSize);
    
    const contadorProductos = await Producto.countDocuments({
        ...queryFiltro,
        ...categoriaFiltro,
        ...valoracionFiltro,
        ...precioFiltro
    });
    res.send({
        productos,
        contadorProductos,
        pagina,
        pages: Math.ceil(contadorProductos / paginaSize),
    });
}))

productoRouter.get('/categorias', expressAsyncHandler(async (req, res) => {
    // Traemos todas las categorias
    const categorias = await Producto.find().distinct('categoria')
    res.send(categorias)
}))

// Fetch a la base de datos para conseguir el producto
productoRouter.get('/slug/:slug', async (req, res) => {
    const producto = await Producto.findOne({slug: req.params.slug});
    // El producto existe
    if(producto) {
        res.send(producto)
    }
    // No existe el producto
    else {
        res.status(404).send({message: 'Producto no encontrado'})
    }
});
// Fetch a la base de datos para conseguir el producto por el id
productoRouter.get('/:id', async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    // El producto existe
    if(producto) {
        res.send(producto)
    }
    // No existe el producto
    else {
        res.status(404).send({message: 'Producto no encontrado'})
    }
});

export default productoRouter;