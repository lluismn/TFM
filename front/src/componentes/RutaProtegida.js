import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Tienda } from "../vistas/VistaTienda";

function RutaProtegida({children}) {
    // Ruta para proteger de cualquier usuario, como acceder a administrador

    const {state} = useContext(Tienda);
    const {usuarioInfo} = state;
    
    return usuarioInfo ? children : <Navigate to='/login' />
}

export default RutaProtegida;