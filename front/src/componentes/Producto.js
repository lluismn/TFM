import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import Button from "react-bootstrap/Button";
import Valoracion from "./Valoracion";
import axios from "axios";
import { useContext } from "react";
import { Tienda } from "../vistas/VistaTienda";
import { toast } from "react-toastify";


function Producto(props) {
    const {producto} = props;

    const {state, dispatch: contextoDispatch} = useContext(Tienda);
    const {cesta: {cestaItems}} = state;

    const añadirALaCestaHandler = async (item) => {
        const existeItem = cestaItems.find((x) => x._id === producto._id);
        const quantity = existeItem ? existeItem.quantity + 1 : 1;
        // Traemos el objeto
        const {data} = await axios.get(`/api/productos/${item._id}`);

        if (data.numeroEnStock < quantity) {
            window.alert(`Lo sentimos. ${item.nombre} está fuera de stock`)
            return;
        }

        contextoDispatch({
            type:'CESTA_AÑADIR_ITEM', 
            payload: {...item, quantity} // payload añade el producto al contador de la cesta
        });
        toast.success('Se ha añadido el producto a la cesta')
    }

    // HTML de la targeta del producto
    return (
        // Usamos Card de bootstrap
        <Card className="carta-producto">
            <Link to={`/producto/${producto.slug}`}> 
                <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
            </Link>

            <Card.Body className="carta-producto">
                <Link to={`/producto/${producto.slug}`} className='texto-carta'>
                    <Card.Title className="texto-carta">{producto.nombre}</Card.Title>
                </Link>
                <Valoracion valoracion={producto.valoracion} numReviews={producto.numReviews} />
                <Card.Text>{producto.precio}€</Card.Text>
                
                {/* Si no hay stock, desactivamos el botón */}
                {producto.numeroEnStock === 0? <Button variant="light" disabled> Sin stock</Button>
                :
                <Button 
                    onClick={() => añadirALaCestaHandler(producto)} 
                    className="carta-boton">
                        Añadir a la cesta
                </Button>
                }
                
            </Card.Body>
        </Card>
    );
}

export default Producto;