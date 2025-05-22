import React from "react";
import { Link } from 'react-router-dom';
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/CerrarSesion.css";

function CerrarSesion() {

  function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <>
      <div className="cerrarSesion-bg">
        <div className="cerrarSesion-card card p-4 shadow-lg">

          <div className="mb-3">
            <h3>Esta seguro que quiere cerrar sesion?</h3>
          </div>
          <div class="d-grid gap-2">
              <button className="btn w50 btn-primary rounded-pill" onClick={cerrarSesion}>Cerrar</button>
              <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/"}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CerrarSesion;