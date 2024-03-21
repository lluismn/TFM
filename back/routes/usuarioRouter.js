import express from 'express';
import Usuario from '../models/usuarioModelo.js';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler'
import { generarToken, isAuth } from '../utils/utils.js';


const usuarioRouter = express.Router();

// Iniciar sesión
usuarioRouter.post(
    '/login', expressAsyncHandler(async (req, res) => {
        // Encontramos al usuario por el email
        const usuario = await Usuario.findOne({email: req.body.email});
        if (usuario) {
            // Hemos encontrado al usuario
            if (bcrypt.compareSync(req.body.password, usuario.password)) {    // Comprobamos la contraseña
                // La contraseña es correcta
                res.send({
                    _id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    esAdmin: usuario.esAdmin,
                    token: generarToken(usuario)
                });
                return;
            }
        }
        // No hemos encontrado al usuario
        res.status(401).send({ message: 'Email o contraseña incorrectos' })
    })
)

// Registrarse
usuarioRouter.post(
    '/registro',
    expressAsyncHandler(async (req, res) => {
        const nuevoUsuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        })
        // Guardamos el usuario que hemos creado
        const usuario = await nuevoUsuario.save();
        res.send({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            esAdmin: usuario.esAdmin,
            token: generarToken(usuario)
        });
    })
)

usuarioRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
      const usuario = await Usuario.findById(req.params.id);
      if (usuario) {
        res.send(usuario);
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
);

// Actualizar
usuarioRouter.put('/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const usuario = await Usuario.findById(req.usuario._id)    // Traemos al usuario
        console.log(usuario);
        if (usuario) {   // El usuario existe
            console.log(usuario);
            usuario.nombre = req.body.nombre || usuario.nombre   // Si el body tiene nombre, lo actualizamos, sino mantenemos el que tiene
            usuario.email = req.body.email || usuario.email
            if (req.body.password) {   // Comprobamos si existe en el body una contraseña (por default el campo está vacio)
                usuario.password = bcrypt.hashSync(req.body.password, 8)
            }

            const usuarioActualizado = await usuario.save();
            res.send({
                _id: usuarioActualizado._id,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                esAdmin: usuarioActualizado.esAdmin,
                token: generarToken(usuarioActualizado)
            })
        } else {
            res.status(404).send({message: 'Usuario no encontrado'})
        }
    })
)

export default usuarioRouter;