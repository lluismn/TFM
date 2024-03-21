import jwt from 'jsonwebtoken'

export const generarToken = (usuario) => {
    return jwt.sign(
        {
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            esAdmin: usuario.esAdmin,
        }
        , process.env.JWT_SECRET, {
            expiresIn: '30d'   // cuando caduca el token
        })    
}

// Validar al usuario
export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.lenght);  // Empezamos a leer el token despues de los 7 primero caracteres ( Bearer XXXXX) hasta el final del token
        // Verificamos el token
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (error, decode) => {
                if (error) {
                    res.status(401).send({ message: 'Token invalido' });
                } else {
                    req.usuario = decode;
                    next();
                }
            }
        )
    } else {
        res.status(401).send({ message: 'No hay un token de autenticacion' });
    }
}