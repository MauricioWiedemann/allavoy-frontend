import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '../../sources/logo.png';
import "../css/Navbar.css";

function NavbarVendedor() {
  const [showGestion, setShowGestion] = useState(false);
  const [showPasajes, setShowPasajes] = useState(false);
  const [showUsuario, setShowUsuario] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" />
        <h2>AllaVoy</h2>
      </div>
      <ul className="navbar-nav ms-auto">
        <li>
          <div className="menu-title" onClick={() => setShowGestion(!showGestion)}>
            <h4>Gestión</h4>
            {showGestion ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showGestion && (
            <>
              <li className="nav-item"> <Link className="nav-link" to="/altalocalidad">Alta Localidad</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/altaomnibus">Alta Omnibus</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/altaviaje">Alta Viaje</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reasignarviaje">Reasignación de viaje</Link></li>
            </>
          )}
        </li>
        <li>
          <div className="menu-title" onClick={() => setShowPasajes(!showPasajes)}>
            <h4>Pasajes</h4>
            {showPasajes ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showPasajes && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/">Compra</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cierreventa">Cierre de venta</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/">Listado de ventas</Link></li>
            </>
          )}
        </li>
        <li>
          <div className="menu-title" onClick={() => setShowUsuario(!showUsuario)}>
            <h4>Usuario</h4>
            {showUsuario ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showUsuario && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/">Soporte</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cerrarsesion">Cerrar Sesión</Link></li>
            </>
          )}
        </li>
      </ul>
    </aside>
  )
}

export default NavbarVendedor;
