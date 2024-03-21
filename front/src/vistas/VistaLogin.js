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

function VistaLogin() {
    const navigate = useNavigate();    
    // Cogemos los parametros del url para ver si tenemos algun redirect
    let urlParams = new URLSearchParams(window.location.search)
    const redirectEnUrl = urlParams.get('redirect')
    // Si existe la dirección, le enviamos ahí, sino, por defecto nos envia a la pagina principal
    const redirect = redirectEnUrl ? redirectEnUrl : '/';

    const [email, setEmail] = useState('');  // Declaramos como default el campo vacio
    const [password, setPassword] = useState('');

    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    const {usuarioInfo} = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Hacemos fetch a la api
            const { data } = await axios.post('/api/usuario/login', {
                // Pasamos los datos del formulario
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
                <title>Login</title>
            </Helmet>
            <h1 className="my-3">Inicia sesión</h1>
            <Form onSubmit={submitHandler}>
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
                <div className="mb-3 text-center">
                    <Button type="submit">Inicai sesión</Button>
                </div>

                <div className="mb-3">
                    Nuevo usuario? {' '} 
                    <Link to={`/registro?redirect=${redirect}`}>Crea tu cuenta</Link>
                </div>
            </Form>
        </Container>
    )
}

export default VistaLogin;