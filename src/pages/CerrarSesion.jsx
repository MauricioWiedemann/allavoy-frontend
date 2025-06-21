import React from "react";
import { Link } from 'react-router-dom';
import "../css/CerrarSesion.css";
import { jwtDecode } from 'jwt-decode';

function CerrarSesion() {


  async function cerrarSesion() {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      }).then(response => {
        return response;
      })
    } catch (e) {
      console.log(e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    window.location.href = "/login";
  }

  function cancelar() {
    try {
      const payload = jwtDecode(localStorage.getItem("token"));
      window.location.href = "/home";
    } catch (e) {
      alert("No se encuantra una sesion iniciada.");
      window.location.href = "/login";
    }
  }

  return (
    <>
      <div className="cerrarSesion-bg">
        <div className="cerrarSesion-card card p-4 shadow-lg">

          <div className="mb-3">
            <h3 className="text-center">¿Esta seguro que quiere cerrar sesión?</h3>
          </div>
          <div class="d-grid gap-2">
            <button className="btn w50 btn-primary rounded-pill" onClick={cerrarSesion}>Aceptar</button>
            <button className="btn w50 btn-secondary rounded-pill" onClick={cancelar}>Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CerrarSesion;