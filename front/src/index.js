import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async'
import { ProviderTienda } from './vistas/VistaTienda';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ProviderTienda>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>   {/*  Usamos esta dependencia para poder usar la api de Paypal que ha denevolver a la app  */}
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </ProviderTienda>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
