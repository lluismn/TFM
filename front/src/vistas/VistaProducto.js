import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Producto from "../componentes/Producto";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from 'react-bootstrap/ListGroup'
import Valoracion from "../componentes/Valoracion";
import Badge from 'react-bootstrap/Badge'
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import CargandoCaja from "../componentes/CargandoCaja";
import CajaMensaje from "../componentes/CajaMensaje";
import { getError } from "../utils";
import { Tienda } from "./VistaTienda";

// Acciones a realizar cuando se cargan elementos
const reducer = (state, action) => {
    switch(action.type) {
      case 'FETCH_REQUEST':
        return {...state, loading: true};
      case 'FETCH_SUCCES':
        return {...state, producto: action.payload, loading: false};
      case 'FETCH_FAIL':
        return {...state, loading: false, error: action.payload};
      default:
        return state;
    }
  };
  

function VistaProducto() {
    const navigate = useNavigate();
    const params = useParams();
    const {slug} = params;

    const [{loading, error, producto}, dispatch] = useReducer((reducer), {
    producto: [], loading: true, error: '',
    });
    useEffect(() => {
    const fetchData = async () => {
        dispatch({type: 'FETCH_REQUEST'})
        try{
        const resultado = await axios.get(`/api/productos/slug/${slug}`);
        dispatch({type: 'FETCH_SUCCES', payload: resultado.data});
        } catch(error) {
        dispatch({type: 'FETCH_FAIL', payload: getError(error)});
        }
    };
    fetchData();
    }, [slug]);

    // Definimos el contexto para añadir a la cesta. Cambiamos el nombre del dispatch para no confundirlo con el dispatch del fetchData
    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    const {cesta} = state;
    // Definimos añadir a la cesta
    const añadirALaCesta = async() => {
        // Declaramos una constante para comprobar si existe el objeto
        const existeItem = cesta.cestaItems.find((x) => x.id === producto.id);
        // Declaramos la constante para añadir a la cesta el objeto si existe
        const quantity = existeItem ? existeItem.quantity + 1 : 1;
        // Traemos el producto 
        const { data } = await axios.get(`/api/productos/${producto.id}`);
        // Si no existe, se lo decimos al usuario
        if (data.numeroEnStock < quantity) {
            window.alert(`Lo sentimos. ${producto.nombre} está fuera de stock`)
            return;
        }

        contextoDispatch({
            type:'CESTA_AÑADIR_ITEM', 
            payload: {...producto, quantity} // payload añade el producto al contador de la cesta
        });
        // Enviamos al usuario a la cesta una vez ha añadido el objeto 
        navigate('/cesta'); 
    }

    return (
        // El producto esta cargando
        loading? (<CargandoCaja />
        ) 
        // Ha habido un error
        : error? (
            <CajaMensaje variant="danger">{error}</CajaMensaje>
        ) : (
        // Todo ha ido bien
        <div>
            <Row>
                <Col md={6}>
                    <img className="img-larger" src={producto.imagen} alt={producto.nombre}></img>
                </Col>
                {/* TODO Hacer estas dos columnas en una, con el precio debajo de la bio */}
                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Helmet>
                                <title>{producto.nombre}</title>
                            </Helmet>
                            <h1>{producto.nombre}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Valoracion valoracion={producto.valoracion} numReviews={producto.numReviews} />
                        </ListGroup.Item>
                        <ListGroup.Item>Precio: {producto.precio}€</ListGroup.Item>
                        <ListGroup.Item>
                            Descripción:<br/>
                            <p>{producto.descripcion}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Precio:</Col>
                                    <Col>{producto.precio}€</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Estado:</Col>
                                    <Col>
                                        {producto.numeroEnStock > 0 ? (
                                            <Badge bg="success">En stock</Badge>
                                        ) : ( 
                                            <Badge bg="danger">Sin stock</Badge>
                                        )}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {producto.numeroEnStock > 0 && (
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button onClick={añadirALaCesta} variant="primary">
                                            Añadir a la cesta
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>)
    );
}

export default VistaProducto;