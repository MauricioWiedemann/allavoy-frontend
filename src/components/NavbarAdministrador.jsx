import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../sources/logo.png';
import "../css/Navbar.css";

function NavbarAdministrador() {
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
          <Link className="nav-link" to="/altausuario">Alta Usuarios</Link>
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

export default NavbarAdministrador;