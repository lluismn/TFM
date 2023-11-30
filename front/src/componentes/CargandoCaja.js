import Spinner from 'react-bootstrap/Spinner';

function CargandoCaja() {
    return (<Spinner animation='border' role='statux'>
        <span className="visually-hidden">Cargando...</span>
    </Spinner>)
}

export default CargandoCaja;