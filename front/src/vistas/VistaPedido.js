import { Helmet } from "react-helmet-async";
import CargandoCaja from "../componentes/CargandoCaja";
import CajaMensaje from "../componentes/CajaMensaje";
import { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Tienda } from "./VistaTienda";
import axios from "axios";
import { getError } from "../utils";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";


function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_SOLICITUD': {
            return {...state, loading: true, error: ''};
        }

        case 'FETCH_EXITO': {
            return {...state, loading: false, pedido: action.payload, error:''};
        }

        case 'FETCH_FALLO': {
            return {...state, loading: false, error: action.payload};
        }

        case 'PAGO_SOLICITUD': {
            return {...state, loadingPago: true};
        }

        case 'PAGO_EXITO': {
            return {...state, loadingPago: false, successPago: true};
        }

        case 'PAGO_ERROR': {
            return {...state, loadingPago: false}  // No enviamos un error porque ya lo enviamos en el state
        }

        case 'PAGO_RESET': {
            return {...state, loadingPago: false, successPago:false};  // Restablecemos todo a false
        }

        default: {
            return state;
        }
    }
}

function VistaPedido() {
    
    const { state } = useContext(Tienda);
    const { usuarioInfo } = state;

    const params = useParams()
    const { id: pedidoId } = params
    const navigate = useNavigate();

    const [{ loading, error, pedido, loadingPago, successPago }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        pedido: {},
        loadingPago: false,
        successPago: false,
    })

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();  // Funciones para ver si esta cargando el script y otro para cargarlo en la pagina, respectivamente

    function createPedido(data, actions) {
        return actions.pedido.create({
            purchase_units: [
                {
                    amount: { value: pedido.totalPrecio }
                }
            ]
        }).then((pedidoId) => {
            return pedidoId;
        })
    }

    // function onApprove(data, actions) {
    //     return actions.pedido.capture().then(async function (details) {
    //         try {
    //             dispatch({ type: 'PAGO_SOLICITUD' });
    //             const { data } = await axios.put(`/api/pedido/${pedido._id}/pago`, details, {
    //                 headers: { authorization: `Bearer ${usuarioInfo.token}`}
    //             });
    //             dispatch({ type: 'PAGO_EXITO', payload: data });  // El pago esta autorizado, como payload pasamos el data
    //             toast.success('El pedido está pagado')  // Notificamos al usuario de que está pagado
    //         } catch (error) {
    //             dispatch({ type: 'PAGO_ERROR', payload: getError(error) });
    //             toast.error(getError(error));
    //         }
    //     })
    // }

    
    function onApprove(data, actions) {
        return actions.pedido.capture().then(async function (details) {   // TODO SOLUCIONAR Cannot read properties of undefined (reading 'capture')   NO ESTA LLEGANDO EL PRECIO TOTAL
            try {
                dispatch({ type: 'PAGO_SOLICITUD' });
                const { data } = await axios.put(`/api/pedido/${pedido._id}/pago`, details, {
                    headers: { authorization: `Bearer ${usuarioInfo.token}`}
                });
                dispatch({ type: 'PAGO_EXITO', payload: data });  // El pago esta autorizado, como payload pasamos el data
                toast.success('El pedido está pagado')  // Notificamos al usuario de que está pagado
            } catch (error) {
                dispatch({ type: 'PAGO_ERROR', payload: getError(error) });
                toast.error(getError(error));
            }
        })
    }



    function onError(err) {
        toast.error(getError(err))
    }

    useEffect(() => {
        const fetchPedido = async () => {  // Definimos las opciones de fetch al pedido
            try{
                dispatch({ type: 'FETCH_SOLICITUD' });
                const { data } = await axios.get(`/api/pedido/${pedidoId}`, {
                    headers: { Authorization: `Bearer ${usuarioInfo.token}` },
                });
                dispatch({ type: 'FETCH_EXITO', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FALLO', payload: getError(err) });
            }
        }

        if (!usuarioInfo) {   // Si el usuario no esta logeado, lo enviamos directamente a la pagina de login
            return navigate('/login');
        }
        if (!pedido._id || successPago || (pedido._id && pedido._id !== pedidoId)) {
            fetchPedido();
            if (successPago) {
                dispatch({ type: 'PAGO_RESET' })  // Si ya está pagado, lo reseteamos
            }
        } else {
            const loadPaypalScript = async () => {   // Instanciamos la api de Paypal
                const { data: clienteId }= await axios.get('/api/keys/paypal', {
                    headers: { Authorization: `Bearer ${usuarioInfo.token}` }
                });
            paypalDispatch({  // Definimos el tipo de pago y el cliente vincuado al pago
                type: 'resetOptions',
                value: {
                    'client-id': clienteId,
                    currency: 'EUR'
                }
            })
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            loadPaypalScript();
        }
    }, [usuarioInfo, navigate, pedidoId, pedido, paypalDispatch, successPago]);

    return (
        loading?
        ( 
            <div className="text-center">
                <Helmet>
                    <title>Cargando...</title>
                </Helmet>
                <br/>
                <CargandoCaja></CargandoCaja> 
            </div>
        )
        :
        error ? (
            <CajaMensaje variant='danger'>{error}</CajaMensaje>
        )
        :
        (
            <div>
                <Helmet>
                    <title>Pedido {pedidoId}</title>
                </Helmet>
                <h1 className="my-3">Pedido {pedidoId}</h1>
                <Row>
                    <Col md={8}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Envio</Card.Title>
                                <Card.Text>
                                    <strong>Nombre: </strong>{pedido.envio.nombreCompleto} <br />
                                    <strong>Dirección: </strong>{pedido.envio.direccion},
                                    {pedido.envio.ciudad}, {pedido.envio.codigoPostal}, {pedido.envio.ciudad}
                                </Card.Text>
                                {pedido.estaEnviado ? (
                                    <CajaMensaje variant='success'>
                                        Enviado a {pedido.enviadoA.substring(0, 10)}
                                    </CajaMensaje>
                                ) : (
                                    <CajaMensaje variant='danger'>No enviado</CajaMensaje>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Pago</Card.Title>
                                <Card.Text>
                                    <strong>Metodo: </strong> {pedido.metodoPago}
                                </Card.Text>
                                {pedido.estaPagado ? (
                                    <CajaMensaje variant='success'>Pagado a {pedido.pagadoA.substring(0, 10)}</CajaMensaje>
                                ) : (
                                    <CajaMensaje variant='danger'>No pagado</CajaMensaje>
                                )}
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Productos</Card.Title>
                                <ListGroup variant='flush'>
                                    {pedido.pedidoItems.map((item) => (
                                        <ListGroup.Item key={item.producto._id}>
                                            <Row>
                                                <Col md={6}>
                                                    <img src={item.imagen} alt={item.nombre} className="img-fluid rounded img-thumbnail"></img> {' '}
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
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Resumen del pedido</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Productos</Col>
                                            <Col>{pedido.precioItems}€</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Envio</Col>
                                            <Col>{pedido.precioEnvio}€</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Impuestos</Col>
                                            <Col>{pedido.precioImpuestos}€</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Precio total</strong></Col>
                                            <Col><strong>{pedido.totalPrecio}€</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <br/>
                                    {/* Introducimos la api de paypal */}
                                    {!pedido.estaPagado && (
                                        // El pedido no esta pagado, así que habilitamos el pago por paypal
                                        <ListGroup.Item>
                                            {isPending ? (
                                                <CargandoCaja />
                                            ) : (
                                                <div>
                                                    <PayPalButtons
                                                        createPedido={createPedido}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                    ></PayPalButtons>
                                                </div>
                                            )}
                                            {/* Si el pago se está cargando, mostramos un efecto de cargar */}
                                            {loadingPago && <CargandoCaja></CargandoCaja>}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
            </div>
        )
    )
        
}

export default VistaPedido;