import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

function PasosCheckout(props) {
    return (
        <Row className="checkout-pasos">
            {/* Marcamos los pasos que se han completado para hacer el pago */}
            <Col className={props.paso1 ? 'active' : ''}>Login</Col>
            <Col className={props.paso2 ? 'active' : ''}>Envio</Col>
            <Col className={props.paso3 ? 'active' : ''}>Pago</Col>
            <Col className={props.paso4 ? 'active' : ''}>Realizar pedido</Col>

        </Row>
    )
}

export default PasosCheckout;