import { Helmet } from "react-helmet-async";
import PasosCheckout from "../componentes/PasosCheckout.js";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { useContext, useEffect, useState } from "react";
import { Tienda } from "./VistaTienda";
import { useNavigate } from "react-router-dom";

function VistaMetodoPago(){

    const navigate = useNavigate();
    const {state, dispatch: contextoDispatch} = useContext(Tienda);

    const {
        cesta: { envio, metodoPago } 
    } = state;

    // Definimos los metodos de pago
    const [metodoPagoNombre, setMetodoPago] = useState(
        metodoPago || 'PayPal'
    )

    useEffect(() => {
        if(!envio.direccion) {
            // Si no hay direccion de envio, redirigimos al usuario a la pagina de envio
            navigate('/envio');
        }
    }, [envio, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        contextoDispatch({ type: 'GUARDAR_METODO_PAGO', payload: metodoPagoNombre})
        localStorage.setItem('metodoPago', metodoPagoNombre)   // Guardamos el metodo de pago seleccionado
        navigate('/realizarPedido')
    }

    return (
        <div>
            <Helmet>
                <title>Métodos de pago</title>
            </Helmet>
            
            <PasosCheckout paso1 paso2 paso3></PasosCheckout>
            
            <div className='container small-container'>
                <h1 className="my-3">Métodos de Pago</h1>
                <Form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Form.Check 
                            type='radio'
                            id="PayPal"
                            label="PayPal"
                            value="PayPal"
                            checked={metodoPagoNombre === "PayPal"}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        />
                        <Form.Check 
                            type='radio'
                            id="Stripe"
                            label="Stripe"
                            value="Stripe"
                            checked={metodoPagoNombre === "Stripe"}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Continuar</Button>
                    </div>
                </Form>
            </div>
        </div>

    )

}

export default VistaMetodoPago;