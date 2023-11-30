import { useContext } from "react";
import { Tienda } from "./VistaTienda";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link, useNavigate } from "react-router-dom";
import CajaMensaje from "../componentes/CajaMensaje";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from "axios";

function VistaCesta() {
    const navigate = useNavigate();
    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    const {cesta: {cestaItems}} = state;

    // Funcion para modificar la cantidad de la cesta llamando a la base de datos
    const actualizaCestaHandler = async (item, quantity) => {
        // Traemos el objeto
        const {data} = await axios.get(`/api/productos/${item.id}`);

        if (data.numeroEnStock < quantity) {
            window.alert(`Lo sentimos. ${item.nombre} está fuera de stock`)
            return;
        }

        contextoDispatch({
            type:'CESTA_AÑADIR_ITEM', 
            payload: {...item, quantity} // payload añade el producto al contador de la cesta
        });
    }

    // Función para quitar un objeto de la cesta
    const quitarItemHandler = (item) => {
        contextoDispatch({type:'CESTA_QUITAR_ITEM', payload: item})
    }

    const pagarHandler = () => {
        // Creamos una query que si el usuario no esta logeado, nos envia a la pagina de inciar sesión, sino lo envia a la pagina de envios
        navigate('/login?redirect=/envio');
    }

    return (
        <div>
            <Helmet>
                <title>Cesta</title>
            </Helmet>
            <h1>Mi cesta</h1>
            <Row>
                <Col md={8}>
                    {/* Si la cesta esta vacía, mostramos un mensaje avisando al usuario */}
                    {cestaItems.length === 0 ? (
                        <CajaMensaje>
                            No hay productos en tu cesta de compras. Haz click para ir a buscar algo que te guste!
                            <br />
                            <Link to='/'>Comprar</Link>
                        </CajaMensaje>
                    ):
                    // Si hay objetos, mostramos lo objetos que haya seleccionado el usuario
                    (
                        <ListGroup>
                            {cestaItems.map((item) => (
                                <ListGroup.Item key={item.id}>
                                    <Row className="align-items-center">
                                        <Col md={4}>
                                            <img src={item.imagen} alt={item.nombre} className="img-fluid rounded img-thumbnail"></img>{' '} 
                                            <Link to={`/producto/${item.slug}`}>{item.nombre}</Link>
                                        </Col>
                                        {/* Boton para modificar la cantidad de productos de un mismo objeto */}
                                        <Col md={3}>
                                            <Button 
                                                vairnat='light' 
                                                onClick={() => actualizaCestaHandler(item, item.quantity - 1)} 
                                                disabled={item.quantity === 1}>    {/* Si la cantidad es menor a 1, se desactiva */}
                                                    <i className="fas fa-minus-circle"></i>
                                            </Button>{'  '}
                                            <span>{item.quantity}</span>{'  '}
                                            <Button 
                                                vairnat='light' 
                                                onClick={() => actualizaCestaHandler(item, item.quantity + 1)} 
                                                disabled={item.quantity === item.numeroEnStock}>
                                                    <i className="fas fa-plus-circle"></i>
                                            </Button>{'  '}
                                        </Col>
                                        <Col md={3}>{item.precio}€</Col>
                                        <Col md={2}>
                                            {/* Boton para borrar el producto de la cesta */}
                                            <Button 
                                                variant='light'
                                                onClick={() => quitarItemHandler(item)}>
                                                    <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )
                    }
                </Col>
                <Col md={4}>
                    <Card>
                    <Card.Body>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                {/* Mostramos el total de dinero que va a costar sumando todo */}
                                <h3>
                                    Total ({cestaItems.reduce((a, c) => a + c.quantity, 0)}{' '}items) :{' '}
                                    <br />
                                    {cestaItems.reduce((a, c) => a+ c.precio * c.quantity, 0)}€
                                </h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <div className="d-grid">
                                    <Button
                                        type='button' 
                                        variant="primary" 
                                        onClick={pagarHandler}
                                        disabled={cestaItems.length === 0}>
                                            Procede a pagar
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default VistaCesta;