import React from "react";
import NavbarAdministrador from "../components/NavbarAdministrador";
import "../css/altausuario.css"


function AltaUsuario() {
  return (
    <>
      <NavbarAdministrador />
      <div className="altausuario-bg">
        <div className="altausuario-card card p-4 shadow-lg">
          <div className="mb-3">
            <input type="email" className="form-control rounded-pill" placeholder="Correo" />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control rounded-pill" placeholder="Nombre" />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control rounded-pill" placeholder="Apellido" />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control rounded-pill" placeholder="Cédula" />
          </div>
          <div className="mb-3">
            <input type="date" className="form-control rounded-pill" placeholder="Fecha de Nacimiento" />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control rounded-pill" placeholder="Contraseña" />
          </div>

          <select className="form-select rounded-pill mb-3" >
            <option value="" disabled selected>Departamento</option>
            <option value="Artigas">Vendedor</option>
            <option value="Canelones">Administrador</option>
          </select>

          <button className="btn btn-primary w-100 rounded-pill">Crear Usuario</button>
          <button className="btn btn-secondary w-100 rounded-pill">Cancelar</button>
        </div>
      </div>
    </>
  );
}

export default AltaUsuario;