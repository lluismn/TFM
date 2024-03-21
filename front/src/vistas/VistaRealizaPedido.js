import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import PasosCheckout from "../componentes/PasosCheckout";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import ListGroup from 'react-bootstrap/ListGroup'
import { Link, useNavigate } from "react-router-dom";
import { Tienda } from "./VistaTienda";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Axios from "axios";
import CargandoCaja from "../componentes/CargandoCaja";


const reducer = (state, action) => {
    switch (action.type) {
        case 'CREAR_SOLICITUD': {
            // Detectamos una solicitud, mantenemos el state y mientras se realiza la solicitud, ponemos el loading a true
            return {...state, loading: true};
        }
        
        case 'CREAR_EXITO': {
            // Todo ha ido bien, desactivamos el loading
            return {...state, loading: true};
        }
       
        case 'CREAR_FALLO': {
            // Ha ido mal, desactivamos el loading
            return {...state, loading: true};
        }

        default: {
            return state;
        }
            
    }
}

function VistaRealizaPedido() {

    const navigate = useNavigate();

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false,
    });

    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    const { cesta, usuarioInfo } = state;

    // Redondea los numeros a que solo tenga dos decimales
    const redondea = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    // Calculamos el precio total de los productos
    cesta.precioItems = redondea(
        cesta.cestaItems.reduce((a, c) => a + c.quantity * c.precio, 0)
    );

    // Calculamos el precio del envio, si el precio de los productos supera 100€, no le cobramos
    cesta.precioEnvio = cesta.precioItems > 99.99 ? redondea(0) : redondea(10);
    // Al calcular los impuestos, le añadimos un 15%
    cesta.precioImpuestos = redondea(cesta.precioItems * 0.15);
    // Sumamos todos los precios para dar el total
    cesta.totalPrecio = cesta.precioItems + cesta.precioEnvio + cesta.precioImpuestos;

    const realizarPedidoHandler = async () => {
        try{
            // Mandamos la solicitud para crear
            dispatch({ type: 'CREAR_SOLICITUD'})

            // Hacemos fetch al back
            const { data } = await Axios.post('/api/pedido',
            {
                pedidoItems: cesta.cestaItems,
                envio: cesta.envio,
                metodoPago: cesta.metodoPago,
                precioItems: cesta.precioItems,
                precioEnvio: cesta.precioEnvio,
                precioImpuestos: cesta.precioImpuestos,
                totalPrecio: cesta.totalPrecio,
            },
            {
                // Traemos al usuario usando su token
                headers: {
                    Authorization: `Bearer ${usuarioInfo.token}`,
                }
            });
            // Vaciamos la cesta una vez ya hemos enviado toda la información
            contextoDispatch({ type: 'VACIAR_CESTA' });
            // Comunicamos que todo ha ido bien
            dispatch({ type: 'CREAR_EXITO' });
            localStorage.removeItem('cestaItems');   // Vaciamos la cesta del localstorage
            navigate(`/pedido/${data.pedido._id}`);  // Enviamos al usuario a la pagina del pedido para que pueda ver toda la información final

        } catch (err) {
            dispatch({type: 'CREAR_FALLO'});
            toast.error(getError(err))
        }
    }

    useEffect(() => {
        if(!cesta.metodoPago) {
            // Si no hay un metodo de pago, redirigimos directamente al usuario a la pagina de pago
            navigate('/pago')
        }
    }, [cesta, navigate])

    return <div>
            <Helmet>
                <title>Realizar pedido</title>
            </Helmet>

            <PasosCheckout paso1 paso2 paso3 paso4></PasosCheckout>
            <br/>
            <h1 className="mb-3">Previsualiza tu pedido</h1>
            <Row>
                <Col md={8}>
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Envio</Card.Title>
                            <Card.Text>
                                <strong>Nombre:</strong> {cesta.envio.nombreCompleto} <br />
                                <strong>Dirección:</strong> {cesta.envio.direccion}, {' '}
                                {cesta.envio.ciudad}, {cesta.envio.codigoPostal}, {cesta.envio.pais}
                            </Card.Text>
                            <Link to={'/envio'}>Editar</Link>
                        </Card.Body>
                    </Card>
                    
                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Pago</Card.Title>
                            <Card.Text>
                                <strong>Forma de pago:</strong> {cesta.metodoPago} <br/>
                            </Card.Text>
                            <Link to={'/pago'}>Editar</Link>
                        </Card.Body>
                    </Card>

                    <Card className='mb-3'>
                        <Card.Body>
                            <Card.Title>Productos en la cesta</Card.Title>
                            <ListGroup variant="flush" >
                                {cesta.cestaItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img src={item.imagen} alt={item.nombre} className="img-fluid img-thumbnail"></img>{' '}
                                                <Link to={`/producto/${item.slug}`}>{item.nombre}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>{item.precio}€</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to={'/cesta'}>Editar</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Resumen del pedido</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Productos</Col>
                                        <Col>{cesta.precioItems}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Envio</Col>
                                        <Col>{cesta.precioEnvio}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Impuestos</Col>
                                        <Col>{cesta.precioImpuestos}€</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Total a pagar</strong></Col>
                                        <Col><strong>{cesta.totalPrecio}€</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button type="button" onClick={realizarPedidoHandler} disabled={cesta.cestaItems.length === 0}>
                                            Ralizar pedido
                                        </Button>
                                    </div>
                                    {loading && 
                                    <div className="text-center">
                                        <br/>
                                        <CargandoCaja></CargandoCaja>
                                    </div>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
}

export default VistaRealizaPedido;