import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '../../sources/logo.png';
import "../css/Navbar.css";

function NavbarVendedor() {
  const [showLocalidad, setShowLocalidad] = useState(false);
  const [showOmnibus, setShowOmnibus] = useState(false);
  const [showViajes, setShowViajes] = useState(false);
  const [showPasajes, setShowPasajes] = useState(false);
  const [showUsuario, setShowUsuario] = useState(false);
  const [showClientes, setShowClientes] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" />
        <h2>AllaVoy</h2>
      </div>
      <div className='navbar-scroll'>
        <ul className="navbar-nav ms-auto">
        <li>
          <div className="menu-title" onClick={() => setShowLocalidad(!showLocalidad)}>
            <h4>Localidades</h4>
            {showLocalidad ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showLocalidad && (
            <>
              <li className="nav-item"> <Link className="nav-link" to="/altalocalidad">Alta Localidad</Link></li>
            </>
          )}
        </li>
        <li>
          <div className="menu-title" onClick={() => setShowOmnibus(!showOmnibus)}>
            <h4>Omnibus</h4>
            {showOmnibus ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showOmnibus && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/altaomnibus">Alta Omnibus</Link></li>
              <li className="nav-item"> <Link className="nav-link" to="/listaromnibus">Listado de Omnibus</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/deshabilitacionomnibus">Deshabilitar Omnibus</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/rehabilitacionomnibus">Rehabilitar Omnibus</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cambiarlocalidad">Cambiar Localidad</Link></li>
            </>
          )}
        </li>
        <li>
          <div className="menu-title" onClick={() => setShowViajes(!showViajes)}>
            <h4>Viajes</h4>
            {showViajes ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showViajes && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/altaviaje">Alta Viaje</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/omnibusasignados">Viajes Asignados a un Ómnibus</Link></li>
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
              <li className="nav-item"><Link className="nav-link" to="/buscarcomprar">Compra</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cierreventa">Cierre de venta</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/listarpasajes">Listado de ventas</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/listadoviajeconpasaje">Devolucion de pasajes</Link></li>
            </>
          )}
        </li>
        <li>
          <div className="menu-title" onClick={() => setShowClientes(!showClientes)}>
            <h4>Clientes</h4>
            {showClientes ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showClientes && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/aplicardescuento">Aplicar Descuentos</Link></li>
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
              <li className="nav-item"><Link className="nav-link" to="/editarusuario">Editar Perfil</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cambiarpass">Cambiar contraseña</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cerrarsesion">Cerrar Sesión</Link></li>
            </>
          )}
        </li>
      </ul>
      </div>
    </aside>
  )
}

export default NavbarVendedor;
