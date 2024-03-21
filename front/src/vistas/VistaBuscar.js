import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Valoracion from "../componentes/Valoracion";
import CargandoCaja from "../componentes/CargandoCaja";
import CajaMensaje from "../componentes/CajaMensaje";
import Button from "react-bootstrap/Button";
import Producto from "../componentes/Producto";


function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_SOLICITUD': {
            return {...state, loading: true};
        }

        case 'FETCH_EXITO': {
            return {
                ...state, 
                loading: false, 
                productos: action.payload.productos,
                pagina: action.payload.pagina,
                paginas: action.payload.paginas,
                contadorProductos: action.payload.contadorProductos,
            };
        }

        case 'FETCH_FALLO': {
            return {...state, loading: false, error: action.payload};
        }

        default: {
            return state;
        }
    }
}

const precios = [
    {
        nombre: '1€ a 25€',
        value: '1-25'
    },
    {
        nombre: '25€ a 50€',
        value: '25-50'
    },
    {
        nombre: '50€ a 75€',
        value: '50-75'
    },
    {
        nombre: '75€ a 100€',
        value: '75-100'
    }
];

export const valoraciones = [
    {
        nombre: '4 estrellas & más',
        valoracion: 4
    },
    {
        nombre: '3 estrellas & más',
        valoracion: 3
    },
    {
        nombre: '2 estrellas & más',
        valoracion: 2
    },
    {
        nombre: '1 estrellas & más',
        valoracion: 1
    }
];

function VistaBuscar() {
    const navigate = useNavigate();
    let urlParams = new URLSearchParams(window.location.search)

    const categoria = urlParams.get('categoria') || 'all';
    const query = urlParams.get('query') || 'all';
    const precio = urlParams.get('precio') || 'all';
    const valoracion = urlParams.get('valoracion') || 'all';
    const orden = urlParams.get('orden') || 'newest';
    const pagina = urlParams.get('pagina') || '1';

    const [{ loading, error, productos, paginas, contadorProductos }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(
                    `/api/productos/buscar?pagina=${pagina}&query=${query}&categoria=${categoria}&precio=${precio}&valoracion=${valoracion}&orden=${orden}`
                );
                dispatch({type: 'FETCH_EXITO', payload: data})
            } catch (err) {
                dispatch({type: 'FETCH_FALLO', payload: getError(err)})
            }
        }

        fetchData();
    }, [categoria, orden, pagina, precio, query, valoracion]) // Cada vez que una de las dependencias cambia, se hace todo el fetch otra vez

    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        const fetchCategorias = async() => {
            try{
                const {data} = await axios.get(`/api/productos/categorias`);
                setCategorias(data)
            } catch (err) {
                toast.error(getError(err))
            }
        }
        fetchCategorias();
    }, [dispatch])

    const getFiltroUrl = (filter) => {
        // Filtro para detectar cambios en la url
        const filtroPagina = filter.pagina || pagina;
        const filtroCategoria = filter.categoria || categoria;
        const filtroQuery = filter.query || query;
        const filtroValoracion = filter.valoracion || valoracion;
        const filtroPrecio = filter.precio || precio;
        const filtroOrden = filter.orden || orden;
        // Devolvemos la url con los filtros que tengan cambios
        return `/buscar?pagina=${filtroPagina}&query=${filtroQuery}&categoria=${filtroCategoria}&precio=${filtroPrecio}&valoracion=${filtroValoracion}&orden=${filtroOrden}`
    }

    return (
        <div>
            <Helmet>
                <title>Buscar productos</title>
            </Helmet>

            <Row>
                <Col md={3}>
                    <h3>Categoria</h3>
                    <div>
                        <ul>
                            <li>
                                <Link 
                                    className={'all' === categoria ? 'text-bold' : ''}
                                    to={getFiltroUrl({ categoria: 'all' })}
                                >
                                    Cualquiera
                                </Link>
                            </li>
                            {categorias.map((c) => (
                                <li key={c}>
                                    <Link
                                        className={c === categoria ? 'text-bold' : ''}
                                        to={getFiltroUrl({ categoria: c })}
                                    >
                                        {c}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Precio</h3>
                        <ul>
                            <li>
                                <Link
                                    className={'all' === precio ? 'text-bold' : ''}
                                    to={getFiltroUrl({ precio: 'all' })}
                                >
                                    Cualquiera
                                </Link>
                            </li>
                            {precios.map((p) => (
                                <li key={p.value}>
                                    <Link
                                        to={getFiltroUrl({precio: p.value})}
                                        className={p.value === precio ? 'text-bold' : ''}
                                    >
                                        {p.nombre}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Valoración</h3>
                        <ul>
                            {valoraciones.map((v) => (
                                <li key={v.nombre}>
                                    <Link
                                        to={getFiltroUrl({valoracion: v.valoracion})}
                                        className={`${v.valoracion}` === `${valoracion}` ? 'text-bold' : ''}
                                    >
                                        <Valoracion caption={' y más'} valoracion={v.valoracion}></Valoracion>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to={getFiltroUrl({valoracion: 'all' })}
                                    className={valoracion === 'all' ? 'text-bold' : ''}
                                >
                                    <Valoracion 
                                        caption={' y más'} 
                                        valoracion={0}
                                    >
                                    </Valoracion>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {loading ? (
                        <CargandoCaja />
                    ) : error ? (
                        <CajaMensaje variant='danger'>{error}</CajaMensaje>
                    ) : (
                        <>
                            <Row className="justify-content-between mb-3">
                                <Col md={6}>
                                    <div>
                                        {contadorProductos === 0 ? 'No' : contadorProductos} Resultados
                                        {query !== 'all' && ' : ' + query}
                                        {categoria !== 'all' && ' : ' + categoria}
                                        {precio !== 'all' && ' : Precio ' + precio}
                                        {valoracion !== 'all' && ' : Valoracion ' + valoracion + ' y más'}
                                        {query !== 'all' ||
                                        categoria !== 'all' ||
                                        valoracion !== 'all' ||
                                        precio !== 'all' ? (
                                            <Button variant="light" onClick={() => navigate('/buscar')}>
                                                <i className="fas fa-times-circle"></i>
                                            </Button>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    Ordenado por{' '}
                                    <select value={orden} onChange={(e) => {
                                        navigate(getFiltroUrl({ orden: e.target.value }))
                                    }}
                                    >
                                        <option value='newest'>Más nuevos</option>
                                        <option value='lowest'>Precio: De menos a más</option>
                                        <option value='highest'>Precio: De más a menos</option>
                                        <option value='toprated'>Mejores opiniones</option>
                                    </select>
                                </Col>
                            </Row>
                            {productos.lenght === 0 && (
                                <CajaMensaje>No se ha encontrado nada</CajaMensaje>
                            )}

                            <Row>
                                {productos.map((producto) => (
                                    <Col sm={6} lg={4} className="mb-3" key={productos._id}>
                                        <Producto producto={producto}></Producto>
                                    </Col>
                                ))}
                            </Row>

                            <div>
                                {[...Array(paginas).keys()].map((x) => (
                                    <Link 
                                        key={x + 1}
                                        className="mx-1"
                                        to={getFiltroUrl({ pagina: x + 1})}
                                    >
                                        <Button
                                            className={Number(pagina) === x + 1 ? 'text-bold' : ''}
                                            variant="light"
                                        >
                                            {x + 1}
                                        </Button>
                                    </Link>
                                ))}
                            </div>

                        </>
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default VistaBuscar;