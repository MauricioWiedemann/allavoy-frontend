import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../sources/logo.png';

export default function Navbar() {
  return (
  <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
         <img
          src={logo}
          alt="Logo"
          style={{ width: '40px', marginRight: '8px' }}
        />
        AllaVoy
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contacto">Contacto</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Iniciar sesión</Link>
          </li>
          <li className="nav-item">
              <Link className="nav-link" to="/analisis">Analisis</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}