import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { Tienda } from './VistaTienda';
import { useNavigate } from 'react-router-dom';
import PasosCheckout from '../componentes/PasosCheckout';

function VistaEnvio() {

    const navigate = useNavigate();
    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    // Cogemos la información del usuario si ya estaba previamente introducida
    const {
        usuarioInfo,
        cesta: {envio},
    } = state

    const [nombreCompleto, setNombreCompleto] = useState(envio.nombreCompleto || '');
    const [direccion, setDireccion] = useState(envio.direccion || '');
    const [ciudad, setCiudad] = useState(envio.ciudad || '');
    const [codigoPostal, setcodigoPostal] = useState(envio.codigoPostal || '');
    const [pais, setPais] = useState(envio.pais || '');

    // Si el usuario no etsa logeado, lo expulsamos de la pagina
    useEffect(() => {
        if(!usuarioInfo) {
            navigate('/login?redirect=/envio')
        }
    }, [usuarioInfo, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        // Guardamos la información de envio del usuario
        contextoDispatch({
            type: "GUARDAR_ENVIO",
            payload: {
                nombreCompleto, direccion, ciudad, codigoPostal, pais
            }
        })
        localStorage.setItem(
            'envio',
            JSON.stringify({
                nombreCompleto, direccion, ciudad, codigoPostal, pais
            })
        )
        navigate('/pago')
    }

    return (
        <div>
            <Helmet>
                <title>Envio</title>
            </Helmet>

            <PasosCheckout paso1 paso2></PasosCheckout>

            <div className='container small-container'>
                <h1 className='my-3'>Dirección de envio</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control 
                        value={nombreCompleto}
                        onChange={(e) => setNombreCompleto(e.target.value)} 
                        required
                        placeholder="Ingrese su nombre y apellido"
                        />
                    <br />
                    <Form.Label>Dirección completa</Form.Label>
                    <Form.Control 
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)} 
                        required
                        placeholder="Ingresa tu dirección completa"
                    />
                    <br />
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control 
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)} 
                        required
                        placeholder="Ingresa tu ciudad"
                    />
                    <br />
                    <Form.Label>Codigo postal</Form.Label>
                    <Form.Control 
                        value={codigoPostal}
                        onChange={(e) => setcodigoPostal(e.target.value)} 
                        required
                        placeholder="Ingresa tu codigo postal"
                    />
                    <br />
                    <Form.Label>Pais</Form.Label>
                    <Form.Control 
                        value={pais}
                        onChange={(e) => setPais(e.target.value)} 
                        required
                        placeholder="Ingresa tu pais"
                    />
                    <br />
                    <div className='mb-3 text-center'>
                        <Button variant='primary' type='submit'>
                            Continuar
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default VistaEnvio;