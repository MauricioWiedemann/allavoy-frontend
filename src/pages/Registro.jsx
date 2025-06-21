import React, { useState } from "react";
import "../css/Registro.css";

function Registro() {

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");

  function validation_digit(ci) {
    var a = 0;
    var i = 0;
    if (ci.length <= 6) {
      for (i = ci.length; i < 7; i++) {
        ci = '0' + ci;
      }
    }
    for (i = 0; i < 7; i++) {
      a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
    }
    if (a % 10 === 0) {
      return 0;
    } else {
      return 10 - a % 10;
    }
  }

  function clean_ci(ci) {
    return ci.replace(/\D/g, '');
  }

  function validate_ci(ci) {
    ci = clean_ci(ci);
    var dig = ci[ci.length - 1];
    ci = ci.replace(/[0-9]$/, '');
    return (dig == validation_digit(ci));
  }

  function registrarUsuario() {
    let statusOk = false;
    if (email.trim() === "" || nombre.trim() === "" || apellido.trim() === "" || cedula.trim() === "" || fechaNacimiento.trim() === "" || password.trim() === "") {
      alert("Complete todos los campos.");
    } else if (!validate_ci(cedula)) {
      alert("La cedula no es valida.");
    } else if (password.length < 8 || !/\d/.test(password)) {
      alert("La contraseña debe tener al menos 8 caracteres e incluir al menos un numero.");
    } else if (new Date(fechaNacimiento) >= new Date()) {
      alert("La fecha de nacimiento no puede ser mayor a hoy.");
    } else {
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
          statusOk = response.ok;
          return response.text();
        })
        .then(data => {
          alert(data);
          if (statusOk){
            window.location.reload();
          }
        })
        .catch(e => {
          alert("Error el registrar la localidad.");
        });
    }
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
