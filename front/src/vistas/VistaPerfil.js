import { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Tienda } from "./VistaTienda";
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from 'axios';


function reducer (action, state) {
    switch(action.type){
        case 'ACTUALIZAR_SOLICITUD': {
            return {...state, loadingUpdate: true}
        }

        case 'ACTUALIZAR_EXITO': {
            return {...state, loadingUpdate: false}
        }

        case 'ACTUALIZAR_FALLO': {
            return {...state, loadingUpdate: false}
        }

        default: {
            return state;
        }
    }
}

function VistaPerfil() {

    const { state, dispatch: contextoDispatch } = useContext(Tienda);
    const { usuarioInfo } = state;
    const [nombre, setNombre] = useState(usuarioInfo.nombre);
    const [email, setEmail] = useState(usuarioInfo.email);
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false
    })

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put('/api/usuario/profile', {
                // Pasamos los datos del formulario
                nombre,
                email,
                password
            },
            {
                headers: { Authorization: `Bearer ${usuarioInfo.token}`}
            }
            );
            dispatch({type: 'ACTUALIZAR_EXITO'})
            contextoDispatch({type: 'USUARIO_LOGIN', payload: data})  // ACtualizamos al usuario
            localStorage.setItem('usuarioInfo', JSON.stringify(data))    // ACtualizamos la informacion en el localstorage
            toast.success('Usuario actualizado con exito')
        } catch (err) {
            dispatch({ type: 'ACTUALIZAR_FALLO'});
            toast.error(getError(err))
        }
    }


    return (
        <div className="container small-container">
            <Helmet>
                <title>Perfil</title>
            </Helmet>
            <br />
            <h1 className="my-3">Perfil</h1>

            <form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmarPassword">
                    <Form.Label>Confirmar contraseña</Form.Label>
                    <Form.Control type="password" onChange={(e) => setConfirmarPassword(e.target.value)} />
                </Form.Group>
                <div className="mb-3 text-center">
                    <Button type="submit">Actualizar</Button>
                </div>
            </form>
        </div>
    )
}

export default VistaPerfil;