// import data from "./data";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import PaginaPrincipal from "./vistas/VistaPrincipal";
import PaginaProducto from './vistas/VistaProducto';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav'
import { useContext, useEffect, useState } from 'react';
import { Tienda } from './vistas/VistaTienda';
import VistaCesta from './vistas/VistaCesta';
import VistaLogin from './vistas/VistaLogin';
import NavDropdown from 'react-bootstrap/NavDropdown'
import VistaEnvio from './vistas/VistaEnvio';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import VistaRegistro from './vistas/VistaRegistro';
import VistaMetodoPago from './vistas/VistaMetodoPago';
import VistaRealizaPedido from './vistas/VistaRealizaPedido';
import VistaPedido from './vistas/VistaPedido';
import VistaHistorialPedidos from './vistas/VistaHistorialPedidos';
import VistaPerfil from './vistas/VistaPerfil';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import Buscador from './componentes/Buscador';
import VistaBuscar from './vistas/VistaBuscar';
import RutaProtegida from './componentes/RutaProtegida';

function App() {
  const {state, dispatch: contextoDispatch} = useContext(Tienda);
  const {cesta, usuarioInfo } = state;

  const logoutHandler = () => {
    contextoDispatch({ type: 'USUARIO_LOGOUT' })
    localStorage.removeItem('usuarioInfo');
    localStorage.removeItem('envio')
    localStorage.removeItem('metodoPago')
    window.location.href='/login';
  }

  // Codigo Barra lateral
  const [barraLateralAbierta, setbarraLateralAbierta] = useState(false);  // Por defecto, la barra lateral tiene un estado false porque no esta abierta
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await axios.get(`/api/productos/categorias`)
        setCategorias(data)
      } catch(err) {
        toast.error(getError(err));
      }
    }

    fetchCategorias();
  }, [])


  return (
    <BrowserRouter>
      <div className={
        barraLateralAbierta
        ? 'd-flex flex-column pagina-contenedor active-cont'
        : 'd-flex flex-column pagina-contenedor'
      }>
      <ToastContainer position='bottom-center' limit={1} />
        <header>
          <Navbar className='fondo-barra' variant="dark" expand='lg'>
            <Container>
              {/* BARRA LATERAL */}
              <Button className='fondo-barra-boton' onClick={() => setbarraLateralAbierta(!barraLateralAbierta)}>
                <i className='fas fa-bars'></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand className='clothy'>Clothy</Navbar.Brand>
              </LinkContainer>
              {/* Con Toggle y Collapse hacemos responsive al navbar y si la pagina es pequeña, creamos una barra que se despliega y desactiva la visibilidad de las 
                  opciones de la barra para pasarlas al desplegable */}
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Buscador />
                <Nav className='me-auto w-100 justify-content-end'>
                  <Link to='/cesta' className='nav-link'>
                    Cesta
                    {/* Si la cesta tiene algun elemento (superior a 0), mostraos un badge */}
                    {cesta.cestaItems.length > 0 && (
                      <Badge pill bg="danger">
                        {/* a=acumulador  c=current item */}
                        {cesta.cestaItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {usuarioInfo ? (
                    // Usuario logeado y enseño su numbre
                    <NavDropdown title={usuarioInfo.nombre} id='basic-nav-dropdown'>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Perfil</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/historialPedidos">
                        <NavDropdown.Item>Historial de pedidos</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className='dropdown-item' to={'#logout'} onClick={logoutHandler}>
                        Logout
                      </Link>
                    </NavDropdown>
                  ) : (
                    // Usuario no logeado, le doy la opción de logearse
                    <Link className='nav-link' to='/login'> Login </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        {/* CONTENIDO BARRA LATERAL */}
        <div className={barraLateralAbierta
          ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
          : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }>
          <Nav className='flex-column text-white w-100 p-2'>
            <Nav.Item className='texto-categoria'>
              <strong>Categorias</strong>
            </Nav.Item>
            {categorias.map((categoria) => (
              <Nav.Item key={categoria} className='link-container'>
                <Link                   
                  to={`/buscar?categoria=${categoria}`}
                  className='link-texto'
                  onClick={() => setbarraLateralAbierta(false)}>
                    {categoria}
                  </Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/" element={<PaginaPrincipal />} />
              <Route path='/producto/:slug' element={<PaginaProducto />} />
              <Route path="/cesta" element={<VistaCesta />} />
              <Route path="/login" element={<VistaLogin />} />
              <Route path="/registro" element={<VistaRegistro />} />
              <Route path="/pago" element={<VistaMetodoPago />} />
              <Route path="/realizarPedido" element={<VistaRealizaPedido />} />
              <Route path="/pedido/:id" element={
                <RutaProtegida>
                  <VistaPedido />
                </RutaProtegida>
              } />

              <Route path="/envio" element={
                <RutaProtegida>
                  <VistaEnvio />
                </RutaProtegida>
              } />

              <Route path="/historialPedidos" element={
                <RutaProtegida>
                  <VistaHistorialPedidos />
                </RutaProtegida>
              } />

              <Route path="/profile" element={
                <RutaProtegida>
                  <VistaPerfil />
                </RutaProtegida>
                } />
              <Route path="/buscar" element={<VistaBuscar />} />
            </Routes>
          </Container>
        </main>
        <footer className='text-center'>Todos los derechos reservados</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
