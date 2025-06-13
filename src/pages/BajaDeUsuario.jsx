import React, { useState, useEffect } from "react";
import "../css/BajaUsuario.css";
import NavbarAdministrador from "../components/NavbarAdministrador";
import { jwtDecode } from 'jwt-decode';

function BajaUsuario() {
    const [email, setEmail] = useState("");
    const [tipo, setTipo] = useState("");
    const [usuario, setUsuarios] = useState([]);
    const [orden, setOrden] = useState("");

    useEffect(() => {
        listar_usuarios_activos();
    }, []);

    function validar_datos() {

        let tipoUsuario = tipo;
        if (tipo === "")
            tipoUsuario = null


        fetch("http://localhost:8080/usuario/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                tipoUsuario: tipoUsuario,
                estado: true
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron usuarios.");
                }
                return response.json();
            })
            .then(data => {
                setUsuarios(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se encontraron usuarios.");
                setUsuarios([]);
            });
    }

    function listar_usuarios_activos() {
        fetch("http://localhost:8080/usuario/listaractivos", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron usuarios.");

                }
                return response.json();
            })
            .then(data => {
                setUsuarios(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se encontraron usuarios.");
                setUsuarios([]);
            });
    }

    function desactivar_usuario(usuario){
        // Se envía el ID del usuario en la URL y el token en el header.
        // El backend dará de baja al usuario y responderá con código HTTP 204 (sin contenido).
        fetch(`http://localhost:8080/usuario/baja/${usuario.idUsuario}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
            if (!response.ok) {
              throw new Error("Error al dar de baja el usuario");
            }
            return response.json();
          })
          .then(data => {
            console.log("Usuario dado de baja:", data);
            alert("Usuario dado de baja");
            window.location.reload();
          })
          .catch(error => {
            console.error("Error:", error);
            alert("Error al dar de baja el usuario.");
          });
      
    }

    function capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const usuariosOrdenados = [...usuario];
    if (orden === "nombre")
        usuariosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else if (orden === "tipo")
        usuariosOrdenados.sort((a, b) => a.tipoUsuario.localeCompare(b.tipoUsuario));
    else if (orden === "estado")
        usuariosOrdenados.sort((a, b) => (b.activo === a.activo) ? 0 : a.activo ? -1 : 1);

    function validarTokenUsuario(){
        try {
        let payload = jwtDecode(localStorage.getItem("token"));
        if (payload.rol !== "ADMINISTRADOR")
            window.location.href = "/404";
        } catch (e) {
            window.location.href = "/404";
        }
    }
    
    useEffect(() => {
        validarTokenUsuario();
    }, []);

    return (
        <>
            <NavbarAdministrador />
            <div className="listadoViaje-container">
                <div className="buscador-card card p-4 mt-3 mb-3 shadow-lg">
                    <div className="campos-flex">
                        <input type="text" className="form-control rounded-pill" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <select className="form-select rounded-pill" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="" disabled>Tipo de Usuario</option>
                            <option value="CLIENTE">Cliente</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                            <option value="VENDEDOR">Vendedor</option>
                        </select>

                        <button className="btn btn-primary rounded-pill" onClick={validar_datos}>Buscar</button>
                    </div>
                </div>

                <div className="ordenar-container">
                    <select className="form-select rounded-pill ordenar-select" value={orden} onChange={(e) => setOrden(e.target.value)} >
                        <option value="" selected disabled>Ordenar por</option>
                        <option value="nombre">Nombre</option>
                        <option value="tipo">Tipo</option>
                        <option value="estado">Estado</option>
                    </select>
                </div>

                {<div className="viajes-list">
                    {usuariosOrdenados.map((usuario, index) => (
                        <div key={index} className="viaje-card card p-4 shadow-lg">
                            <h5>{capitalizar(usuario.tipoUsuario)}: {capitalizar(usuario.nombre)} {capitalizar(usuario.apellido)}</h5>
                            <div className="d-flex mb-0">
                                <p className="me-3 mb-0">Cedula: {usuario.cedula}</p>
                                <p className="mb-0">Fecha nacimiento: {usuario.fechaNacimiento}</p>
                            </div>
                            <p className="mb-0">Correo: {usuario.email}</p>
                            <p className="mb-0">Descuento: {usuario.tipoDescuento}</p>
                            <button className="btn btn-danger btn-sm rounded-pill comprar-btn" onClick={() => desactivar_usuario(usuario)}>Desactivar</button>
                        </div>
                    ))}
                </div>}

            </div >
        </>
    );
}

export default BajaUsuario;
