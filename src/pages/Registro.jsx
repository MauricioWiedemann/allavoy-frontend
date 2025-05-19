import React from "react";
import "../css/Registro.css";

function Registro() {
  return (
    <div className="registro-bg">
      <div className="registro-card card p-4 shadow-lg">
        <div className="text-center mb-4">
          <img src="../sources/logo.png" alt="Registro Illustration" className="registro-img img-fluid" />
        </div>
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

        <button className="btn btn-primary w-100 rounded-pill">Registrarse</button>
      </div>
    </div>
  );
}

export default Registro;
