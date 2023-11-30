import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button";
import { Link, useLocation } from "react-router-dom";

function VistaLogin() {

    const { buscar } = useLocation();
    const redirectEnUrl = new URLSearchParams(buscar).get('redirect');
    // Si existe la dirección, le enviamos ahí, sino, por defecto nos envia a la pagina principal
    const redirect = redirectEnUrl ? redirectEnUrl : '/';

    return (
        <Container className="small-container">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <h1 className="my-3">Inicia sesión</h1>
            <Form>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Correo electronico:</Form.Label>
                    <Form.Control type="email" required placeholder="Ingresa tu correo electronico"/>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="pass">
                    <Form.Label>Contraseña:</Form.Label>
                    <Form.Control type="password" required placeholder="Ingresa tu contraseña"/>
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