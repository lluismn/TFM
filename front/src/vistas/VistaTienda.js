import { createContext, useReducer } from "react";

export const Tienda = createContext();

// La cesta de la compra
const initialState = {

    usuarioInfo: localStorage.getItem('usuarioInfo')  // Comprobamos en el localstorage si hay info de usuario (si esta logeado)
    ? JSON.parse(localStorage.getItem('usuarioInfo'))  // Si hay info, la parseamos a JSON
    : null,   // Si no encontramos, la establecemos a null por defecto

    cesta: {
        envio: localStorage.getItem('envio')
            ? JSON.parse(localStorage.getItem('envio'))
            : {},

        metodoPago: localStorage.getItem('metodoPago')
            ? localStorage.getItem('metodoPago')
            : '',

        cestaItems: 
            // Comprobamos si hay objetos en el local storage, si no hay, ponemos un array vacio
            localStorage.getItem('cestaItems')
            ? JSON.parse(localStorage.getItem("cestaItems")) 
            : [],
    }
};

// Las acciones que realizará la cesta
function reducer(state, action) {
    switch (action.type) {
        // Añadir algo a la cesta
        case 'CESTA_AÑADIR_ITEM': {
            const nuevoItem = action.payload;
            const existeItem = state.cesta.cestaItems.find(
                (item) => item._id === nuevoItem._id
            )
            // Comparamos el objeto que quiere el usuario con el comprobante de si existe
            // Si el objeto existe, lo añadimos a la cesta
            const cestaItems = existeItem
            ? state.cesta.cestaItems.map((item) =>
                item._id === existeItem._id ? nuevoItem : item)
            : [...state.cesta.cestaItems, nuevoItem];
            // Guardamos los datos en el local storage para que no se pierdan
            localStorage.setItem('cestaItems', JSON.stringify(cestaItems))
            return { ...state, cesta: { ...state.cesta, cestaItems}};
        }

        case 'CESTA_QUITAR_ITEM': {
            const cestaItems = state.cesta.cestaItems.filter(
                (item) => item._id !== action.payload._id
            );
            localStorage.setItem('cestaItems', JSON.stringify(cestaItems))
            return {...state, cesta: {...state.cesta, cestaItems}};
        }

        case 'VACIAR_CESTA': {
            return { ...state, cesta: {...state.cesta, cestaItems: []} };
        }

        case 'USUARIO_LOGIN': {
            return { ...state, usuarioInfo: action.payload }   //actualizamos los datos del usuario con los que recibimos del action
        }

        case 'USUARIO_LOGOUT': {
            return { ...state, 
                usuarioInfo: null,
                cesta: {
                    cestaItems: [],
                    envio: {},
                    metodoPago: '',
                }
            }
        }

        case "GUARDAR_ENVIO": {
            return {
                ...state,
                cesta: {
                    ...state.cesta,
                    envio: action.payload
                }
            }
        }

        case 'GUARDAR_METODO_PAGO': {
            return {
                ...state,
                cesta: { ...state.cesta, metodoPago: action.payload }
            };
        }

        default:
            return state;
    }
}

export function ProviderTienda(props) {
    const [state, dispatch] = useReducer(reducer, initialState); 
    const value = {state, dispatch};
    return <Tienda.Provider value={value}>{props.children}</Tienda.Provider>
}