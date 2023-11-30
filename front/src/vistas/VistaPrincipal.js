import { useEffect, useReducer } from "react";
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Producto from "../componentes/Producto.js";
import { Helmet } from "react-helmet-async";
import CargandoCaja from "../componentes/CargandoCaja.js";
import CajaMensaje from "../componentes/CajaMensaje.js";

// import data from "../data";

// Acciones a realizar cuando se cargan elementos
const reducer = (state, action) => {
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCES':
      return {...state, productos: action.payload, loading: false};
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};

function VistaPrincipal() {
  const [{loading, error, productos}, dispatch] = useReducer(logger(reducer), {
    productos: [], loading: true, error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: 'FETCH_REQUEST'})
      try{
        const resultado = await axios.get('/api/productos');
        dispatch({type: 'FETCH_SUCCES', payload: resultado.data});
      } catch(error) {
        dispatch({type: 'FETCH_FAIL', payload: error.message});
      }
    };
    fetchData();
  }, []);

  // HTML de la pagina principal
  return <div>
    <Helmet>
      <title>Clothy</title>
    </Helmet>
      <h1>Productos destacados</h1>
        <div className='productos'>
          {loading? (<CargandoCaja />
          ) : error? (
            <CajaMensaje variant="danger">{error}</CajaMensaje>
          ) : (
            <Row>
              {/* Mapeamos los productos para que salgan todos en la */}
              {productos.map(producto => (
                // Declaramos el numero de productos que aparecen segun el tamaño de la vista
                <Col key={producto.slug} sm={6} md={4} lg={3} className='mb-3'>
                  <Producto producto={producto}></Producto>
                </Col>
              ))}
            </Row>
          )}
        </div>
  </div>
}

export default VistaPrincipal;