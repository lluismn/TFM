import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { useContext, useEffect, useState } from "react";
import { Tienda } from "./VistaTienda";
import { toast } from "react-toastify";
import { getError } from "../utils";

function VistaRegistro() {
    const navigate = useNavigate();    
    // Cogemos los parametros del url para ver si tenemos algun redirect
    let urlParams = new URLSearchParams(window.location.search)
    const redirectEnUrl = urlParams.get('redirect')
    // Si existe la dirección, le enviamos ahí, sino, por defecto nos envia a la pagina principal
    const redirect = redirectEnUrl ? redirectEnUrl : '/';

    const [nombre, setNombre] = useState('');  // Declaramos como default el campo vacio
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');

    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    const {usuarioInfo} = state;

    
    const submitHandler = async (e) => {
        e.preventDefault();
        // Validamos que la contraseña sea valida
        if (password !== confirmarPassword) {
            // Las contraseñas no son iguales
            toast.error('Las contraseñas no coinciden')
            return;  // No dejamos que el usuario avance
        }
        try {
            // Hacemos fetch a la api
            const { data } = await axios.post('/api/usuario/registro', {
                // Pasamos los datos del formulario
                nombre,
                email,
                password
            });
            contextoDispatch({type: 'USUARIO_LOGIN', payload: data})
            // Guardamos los datos del usuario en el localstorage
            localStorage.setItem('usuarioInfo', JSON.stringify(data))
            // Redirigimos al usuario a la pagina a la que estaba siendo redigido si es que lo estaba, o a la pagina principal
            navigate(redirect || ('/'));
        } catch (error) {
            toast.error(getError(error))
        }
    }

    // Comprobamos si el usuario esta ya logeado, si lo esta, lo redirigimos
    useEffect(() => {
        if (usuarioInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, usuarioInfo])

    return (
        <Container className="small-container">
            <Helmet>
                <title>Registro</title>
            </Helmet>
            <h1 className="my-3">Registrarse</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label>Nombre completo:</Form.Label>
                    <Form.Control type="text" required placeholder="Ingresa tu nombre"
                    onChange={(e) => setNombre(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Correo electronico:</Form.Label>
                    <Form.Control type="email" required placeholder="Ingresa tu correo electronico"
                    onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="pass">
                    <Form.Label>Contraseña:</Form.Label>
                    <Form.Control type="password" required placeholder="Ingresa tu contraseña"
                    onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="pass">
                    <Form.Label>Confirma la contraseña:</Form.Label>
                    <Form.Control type="password" required placeholder="Repite tu contraseña"
                    onChange={(e) => setConfirmarPassword(e.target.value)}/>
                </Form.Group>
                <div className="mb-3 text-center">
                    <Button type="submit">Registrate</Button>
                </div>

                <div className="mb-3">
                    Ya tienes una cuenta? {' '} 
                    <Link to={`/login?redirect=${redirect}`}>Accede a tu cuenta</Link>
                </div>
            </Form>
        </Container>
    )
}

export default VistaRegistro;