// import data from "./data";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import PaginaPrincipal from "./vistas/VistaPrincipal";
import PaginaProducto from './vistas/VistaProducto';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {LinkContainer} from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import Nav from 'react-bootstrap/Nav'
import { useContext } from 'react';
import { Tienda } from './vistas/VistaTienda';
import VistaCesta from './vistas/VistaCesta';
import VistaLogin from './vistas/VistaLogin';



function App() {
  const {state} = useContext(Tienda);
  const {cesta} = state;
  return (
    <BrowserRouter>
      <div className='d-flex flex-column pagina-contenedor'>
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>Clothy</Navbar.Brand>
              </LinkContainer>
              <Nav className='me-auto'>
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
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className='mt-3'>
            <Routes>
              <Route path="/" element={<PaginaPrincipal />} />
              <Route path='/producto/:slug' element={<PaginaProducto />} />
              <Route path="/cesta" element={<VistaCesta />} />
              <Route path="/login" element={<VistaLogin />} />
            </Routes>
          </Container>
        </main>
        <footer className='text-center'>Todos los derechos reservados</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
