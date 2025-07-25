import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '../../sources/logo.png';
import "../css/Navbar.css";

function NavbarCliente() {
  const [setViajes, setShowViajes] = useState(false);
  const [showUsuario, setShowUsuario] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={() => navigate('/home')}><img src={logo} alt="Logo" /><h2>AlláVoy</h2></div>
      <ul className="navbar-nav ms-auto">
        <li>
          <div className="menu-title" onClick={() => setShowViajes(!setViajes)}>
            <h4>Viajes</h4>{
              setViajes ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </li>
        {setViajes && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/buscar">Buscar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/buscarcomprar">Comprar pasajes</Link></li>
          </>
        )}
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
            <li className="nav-item"><Link className="nav-link" to="/historicocompra">Histórico de pasajes</Link></li>
            <li className="nav-item"><a href="https://wa.me/59896179316" target="_blank" className='nav-link'>Soporte</a></li>
            <li className="nav-item"><Link className="nav-link" to="/cerrarsesion">Cerrar sesión</Link></li>
          </>
        )}
      </ul>
    </aside>
  )
}

export default NavbarCliente;
