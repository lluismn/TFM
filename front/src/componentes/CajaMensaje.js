import Alert from 'react-bootstrap/Alert';

function CajaMensaje(props) {
    return (
        // Si la variante existe, la importamos, sino, mostramos info por defecto
        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
    )
}

export default CajaMensaje;