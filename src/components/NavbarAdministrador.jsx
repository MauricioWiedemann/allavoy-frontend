import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '../../sources/logo.png';
import "../css/Navbar.css";

function NavbarAdministrador() {
  const [showGestion, setShowGestion] = useState(false);
  const [showUsuario, setShowUsuario] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/home')}><img src={logo} alt="Logo" /><h2>AlláVoy</h2></div>
      <ul className="navbar-nav ms-auto">
        <li>
          <div className="menu-title" onClick={() => setShowGestion(!showGestion)}>
            <h4>Gestión</h4>
            {showGestion ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {showGestion && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/altausuario">Alta usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/listausuarios">Listado de usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/bajausuario">Baja de usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/estidisticausuario">Estadísticas de usuarios</Link></li>
          </>)
        }
        <li>
          <div className="menu-title" onClick={() => setShowUsuario(!showUsuario)}>
            <h4>Usuario</h4>
            {showUsuario ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {showUsuario && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/editarusuario">Editar perfil</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/cambiarpass">Cambiar contraseña</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/cerrarsesion">Cerrar sesión</Link></li>
          </>
        )}
      </ul>
    </aside>
  )
}

export default NavbarAdministrador;
