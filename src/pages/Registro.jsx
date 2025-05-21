import React, { useState } from "react";
import "../css/Registro.css";

function Registro() {

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");

  function registrarUsuario() {
    fetch("http://localhost:8080/usuario/alta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        fechaNacimiento: fechaNacimiento,
        tipoDescuento: "NA",
        tipoUsuario: "CLIENTE"
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al registrar usuario");
        }
        return response.json();
      })
      .then(data => {
        console.log("Usuario registrado:", data);
        alert("OK");
      })
      .catch(error => {
        console.error("Error:", error);
        alert("ERROR");
      });
  }

  return (
    <div className="registro-bg">
      <div className="registro-card card p-4 shadow-lg">
        <div className="text-center mb-4">
          <img src="../sources/logo.png" alt="Registro Illustration" className="registro-img img-fluid" />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control rounded-pill" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control rounded-pill" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control rounded-pill" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control rounded-pill" placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="date" className="form-control rounded-pill" placeholder="Fecha de Nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="btn btn-primary w-100 rounded-pill" onClick={registrarUsuario}>Registrarse</button>
      </div>
    </div>
  );
}

export default Registro;
