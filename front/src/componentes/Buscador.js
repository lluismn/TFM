import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Buscador() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/buscar/?query=${query}` : '/search')  // Si existe una query de busqueda, redirigimos al usuario ahí, sino a buscar por defecto
    } 

    return (
        <Form className='d-flex me-auto' onSubmit={submitHandler}>
            <InputGroup>
                <FormControl 
                    type='text' 
                    name='q' 
                    id='q' 
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    aria-label='Buscar Productos'
                    aria-describedby='button-search'
                ></FormControl>
                <Button className='button-search' type='submit' id='button-search'>
                    <i className="fas fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    )
}

export default Buscador;