import React from "react";
import { Link } from 'react-router-dom';
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/CerrarSesion.css";

function CerrarSesion() {

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    window.location.href = "/login";
  }

  function cancelar() {
    const payload = jwtDecode(localStorage.getItem("token"));
    if (payload.rol === "CLIENTE")
            window.location.href = "/homec";
        else if (payload.rol === "VENDEDOR")
            window.location.href = "/homev";
        else
            window.location.href = "/homea";
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
            <button className="btn w50 btn-secondary rounded-pill" onClick={cancelar}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CerrarSesion;