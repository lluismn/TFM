import express from 'express';
import expressAsyncHandler from 'express-async-handler'
import { isAuth } from '../utils/utils.js';
import Pedido from '../models/pedidoModelo.js';


const pedidoRouter = express.Router();

pedidoRouter.post('/', 
    isAuth, // Middelware para validar que el usuario es autentico
    expressAsyncHandler( async (req, res) =>{
        const newPedido = new Pedido({
            pedidoItems: req.body.pedidoItems.map((x) => ({ ...x, producto: x._id })),
            envio: req.body.envio,
            metodoPago: req.body.metodoPago,
            pagoResultado: req.body.pagoResultado,
            precioItems: req.body.precioItems,
            precioEnvio: req.body.precioEnvio,
            precioImpuestos: req.body.precioImpuestos,
            totalPrecio: req.body.totalPrecio,
            usuario: req.usuario._id
        })

        const pedido = await newPedido.save();
        res.status(201).send({ message: 'Nuevo pedido creado', pedido })
})
);

pedidoRouter.get('/mio', 
    isAuth, 
    expressAsyncHandler( async (req, res) =>{
        const pedidos = await Pedido.find({ usuario: req.usuario._id });
        res.send(pedidos);    
})
);

pedidoRouter.get('/:id', 
    isAuth, 
    expressAsyncHandler( async (req, res) =>{
        const pedido = await Pedido.findById(req.params.id)
    if(pedido) {
        res.send(pedido);
    } else {
        res.status(404).send({message: 'No se ha encontrado el pedido'});
    }
})
);

// Ruta a pagar
pedidoRouter.put('/:id/pago',
    isAuth,
    expressAsyncHandler( async (req, res)=>{
        // Buscamos el pedido
        const pedido = await Pedido.findById(req.params.id)
        if(pedido) {
            // El pedido existe y lo ponemos como pagado
            pedido.estaPagado = true;
            // Declaramos cuando ha sido pagado
            pedido.pagadoA = Date.now();
            // Guardamos los cambios en la base de datos
            pedido.pagoResultado = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            // Guardamos la información actualizada del pedido
            const pedidoActualizado = await pedido.save();
            res.send({ message: 'Pedido pagado', pedido: pedidoActualizado })
        } else {
            res.status(404).send({message: 'El pedido no existe'});
        }

    })
)

export default pedidoRouter;