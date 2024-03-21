import { Helmet } from "react-helmet-async";
import CargandoCaja from "../componentes/CargandoCaja";
import CajaMensaje from "../componentes/CajaMensaje";
import { useContext, useEffect, useReducer } from "react";
import { Tienda } from "./VistaTienda";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import Button from "react-bootstrap/esm/Button";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_SOLICITUD': {
            return {...state, loading: true, error: ''};
        }

        case 'FETCH_EXITO': {
            return {...state, loading: false, pedidos: action.payload};
        }

        case 'FETCH_FALLO': {
            return {...state, loading: false, error: action.payload};
        }
        default: {
            return state;
        }
    }
}

function VistaHistorialPedidos() {

    const { state } = useContext(Tienda);
    const { usuarioInfo } = state;
    const navigate = useNavigate();

    const [{ loading, error, pedidos }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_SOLICITUD' })
            try{
                const {data} = await axios.get(`/api/pedido/mio`,
                {
                    headers:{ Authorization: `Bearer ${usuarioInfo.token}`}
                });
                dispatch({ type: 'FETCH_EXITO', payload: data })  ;            
            } catch (error) {
                dispatch({ type: 'FETCH_FALLO', payload: getError(error)})
            }
        }
        fetchData();
    }, [usuarioInfo])

    return (
        <div>
            <Helmet>
                <title>Historial de pedidos</title>
            </Helmet>

            <h1>Historial de Pedidos</h1>
            {loading ? (
                <div className="text-center">
                    <br />
                    <CargandoCaja></CargandoCaja>
                </div>
            ) : error ? (
                <CajaMensaje variant='danger'>{error}</CajaMensaje>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>FECHA</th>
                            <th>TOTAL</th>
                            <th>PAGADO</th>
                            <th>ENTREGADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido)=>(
                            <tr key={pedido._id}>
                                <td>{pedido._id}</td>
                                <td>{pedido.createdAt.substring(0, 10)}</td>
                                <td>{pedido.total}$</td>
                                <td>{pedido.estaPagado ? pedido.pagadoA.substring(0, 10) : "No"}</td>
                                <td>{pedido.estaEntregado ? pedido.entregadoA.substring(0, 10) : 'No'}</td>
                                <Button type="button" variant="light" onClick={() => {navigate(`/pedido/${pedido._id}`)}}>
                                    Ver detalles
                                </Button>
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default VistaHistorialPedidos;