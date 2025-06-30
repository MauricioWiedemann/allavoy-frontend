import React, { useEffect, useState } from "react";
import NavbarAdministrador from "../components/NavbarAdministrador";
import NavbarVendedor from "../components/NavbarVendedor";
import NavbarCliente from "../components/NavbarCliente";
import "../css/EditarUsuario.css"
import Notificaion from "../components/Notificacion";
import { jwtDecode } from 'jwt-decode';


function EditarPerfil() {

  const [usuario, setUsuario] = useState([]);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [payload, setPayload] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");


  function mostrarAlertaError(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("error")
  };

  function mostrarAlerta(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("mensaje")
  };

  function obtenerDatosUsuario() {
    if (payload !== "") {
      fetch("https://allavoy-backend.onrender.com/usuario/buscarporid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idUsuario: payload.idUsuario
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos del perfil.");
          }
          return response.json();
        })
        .then(data => {
          setEmail(data.correo);
          setNombre(data.nombre);
          setApellido(data.apellido);
          setFechaNacimiento(data.fechaNacimiento);
        })
        .catch(error => {
          console.error("Error:", error);
          mostrarAlertaError("Error al obtener los datos del perfil.");
        });
    }
  }

  function editarUsuario() {
    if (nombre.trim() === "" || apellido.trim() === "" || fechaNacimiento.trim() === "") {
      alert("Complete todos los campos.");
    } else if (new Date(fechaNacimiento) >= new Date()) {
      alert("La fecha de nacimiento no puede ser mayor a hoy.");
    } else {
      fetch("https://allavoy-backend.onrender.com/usuario/editar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idUsuario: payload.idUsuario,
          nombre: nombre,
          apellido: apellido,
          fechaNacimiento: fechaNacimiento,
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al editar el usuario");
          }
          return response.text();
        })
        .then(data => {
          mostrarAlerta(data);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch(error => {
          console.error("Error:", error);
          mostrarAlertaError("Error al editar el usuario.");
        });
    }
  }

  function validarTokenUsuario() {
    try {
      setPayload(jwtDecode(localStorage.getItem("token")));
    } catch (e) {
      window.location.href = "/404";
    }
  }

  useEffect(() => {
    validarTokenUsuario();
  }, []);

  useEffect(() => {
    obtenerDatosUsuario();
  }, [payload]);

  return (
    <>
      {payload.rol === "CLIENTE" && <NavbarCliente />}
      {payload.rol === "VENDEDOR" && <NavbarVendedor />}
      {payload.rol === "ADMINISTRADOR" && <NavbarAdministrador />}
      <div className="editarusuario-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="editarusuario-card card p-4 shadow-lg">
          <div className="mb-3">
            <p>Correo</p>
            <input type="email" className="form-control rounded-pill" placeholder="Correo" value={email} disabled="disabled" />
          </div>
          <div className="mb-3">
            <p>Nombre</p>
            <input type="text" className="form-control rounded-pill" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="mb-3">
            <p>Apellido</p>
            <input type="text" className="form-control rounded-pill" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>
          <div className="mb-3">
            <p>Fecha de Nacimiento</p>
            <input type="date" className="form-control rounded-pill" placeholder="Fecha de Nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
          </div>

          <button className="btn btn-primary w-100 rounded-pill mb-1" onClick={editarUsuario} >Editar Usuario</button>
          <button className="btn btn-secondary w-100 rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
        </div>
      </div>
    </>
  );
}

export default EditarPerfil;