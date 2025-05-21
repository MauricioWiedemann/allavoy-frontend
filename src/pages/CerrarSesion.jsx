import React from "react";
import { Link } from 'react-router-dom';
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/CerrarSesion.css";

function CerrarSesion() {
  return (
    <>
    <div className="cerrarSesion-bg">
      <div className="cerrarSesion-card card p-4 shadow-lg">
        
        <div className="mb-3">
            <h3>Esta seguro que quiere cerrar sesion?</h3>
        </div>
        <div class="d-grid gap-2">
            <Link className="nav-link" to="/login">
                <button className="btn w50 btn-primary rounded-pill">Cerrar</button>
            </Link>
            <Link className="nav-link" to="/">
                <button className="btn w50 btn-secondary rounded-pill">Cancelar</button>
            </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default CerrarSesion;