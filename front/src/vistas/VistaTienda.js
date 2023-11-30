import { createContext, useReducer } from "react";

export const Tienda = createContext();

// La cesta de la compra
const initialState = {
    cesta: {
        cestaItems: 
            // Comprobamos si hay objetos en el local storage, si no hay, ponemos un array vacio
            localStorage.getItem('cestaItems')
            ? JSON.parse(localStorage.getItem("cestaItems")) : [],
    }
};

// Las acciones que realizará la cesta
function reducer(state, action) {
    switch (action.type) {
        // Añadir algo a la cesta
        case 'CESTA_AÑADIR_ITEM': {
            const nuevoItem = action.payload;
            const existeItem = state.cesta.cestaItems.find(
                (item) => item.id === nuevoItem.id
            )
            // Comparamos el objeto que quiere el usuario con el comprobante de si existe
            // Si el objeto existe, lo añadimos a la cesta
            const cestaItems = existeItem
            ? state.cesta.cestaItems.map((item) =>
                item.id === existeItem.id ? nuevoItem : item)
            : [...state.cesta.cestaItems, nuevoItem];
            // Guardamos los datos en el local storage para que no se pierdan
            localStorage.setItem('cestaItems', JSON.stringify(cestaItems))
            return { ...state, cesta: { ...state.cesta, cestaItems}};
        }

        case 'CESTA_QUITAR_ITEM': {
            const cestaItems = state.cesta.cestaItems.filter(
                (item) => item.id !== action.payload.id
            );
            localStorage.setItem('cestaItems', JSON.stringify(cestaItems))
            return {...state, cesta: {...state.cesta, cestaItems}};
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