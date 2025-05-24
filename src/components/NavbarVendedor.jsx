import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../sources/logo.png';
import "../css/Navbar.css";

function NavbarVendedor() {
  return (
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src={logo} alt="Logo"/>
        <h2>AllaVoy</h2>
      </div>
      <ul class="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/">Inicio</Link>
        </li>
        <h4>Gestio</h4>
        <li className="nav-item">
          <Link className="nav-link" to="/altalocalidad">Alta Localidad</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/altaomnibus">Alta Omnibus</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/altaviaje">Alta Viaje</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reasignarviaje">Reasignacion de viaje</Link>
        </li>
        <h4>Pasajes</h4>
        <li className="nav-item">
          <Link className="nav-link" to="/">Compra</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">Cierre de venta</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/">Listado de ventas</Link>
        </li>
        <h4>Usuario</h4>
        <li className="nav-item">
          <Link className="nav-link" to="/">Soporte</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/cerrarsesion">Cerrar Sesion</Link>
        </li>
      </ul>
    </aside>
  )
}

export default NavbarVendedor;