import React, { useState, useEffect } from "react";
import "../css/ListadoUsuario.css";
import NavbarAdministrador from "../components/NavbarAdministrador";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";


function ListadoUsuario() {
    const [email, setEmail] = useState("");
    const [tipo, setTipo] = useState("");
    const [estado, setEstado] = useState("ACTIVO");
    const [usuario, setUsuarios] = useState([]);
    const [orden, setOrden] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipoNoti, setTipoNoti] = useState("");


    function mostrarAlertaError(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipoNoti("error")
    };

    useEffect(() => {
        listar_usuarios();
    }, []);

    function validar_datos() {
        console.log(tipo);

        let activo = false;
        let tipoUsuario = tipo;

        if (estado === "ACTIVO")
            activo = true
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
                estado: activo
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron usuarios.");

                }
                return response.json();
            })
            .then(data => {
                if (data.length < 1) {
                    mostrarAlertaError("No se encontraron usuarios.");
                }
                console.log(data)
                setUsuarios(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron usuarios.");
                setUsuarios([]);
            });
    }

    function listar_usuarios() {
        fetch("http://localhost:8080/usuario/listar", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
                mostrarAlertaError("No se encontraron usuarios.");
                setUsuarios([]);
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

    function validarTokenUsuario() {
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
            <div className="layout">
                <Notificaion mensaje={mensaje} tipo={tipoNoti} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                <div className="filtros">
                    <div className="buscador">
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option value="" disabled>Tipo de Usuario</option>
                            <option value="CLIENTE">Cliente</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                            <option value="VENDEDOR">Vendedor</option>
                        </select>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="ACTIVO">Activo</option>
                            <option value="BLOQUEADO">Bloqueado</option>
                        </select>
                        <button onClick={validar_datos}>Buscar</button>
                    </div>

                    <div className="ordenar">
                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option value="" disabled>Ordenar por</option>
                            <option value="nombre">Nombre</option>
                            <option value="tipo">Tipo</option>
                            <option value="estado">Estado</option>
                        </select>
                    </div>
                </div>

                <div className="usuarios-list">
                    {usuariosOrdenados.map((u, i) => (
                        <div key={i} className="card-usuario">
                            <h5>{capitalizar(u.tipoUsuario)}: {capitalizar(u.nombre)} {capitalizar(u.apellido)}</h5>
                            <div className="linea">
                                <p>Cédula: {u.cedula}</p>
                                <p>Fecha nacimiento: {u.fechaNacimiento}</p>
                            </div>
                            <p>Correo: {u.email}</p>
                            <p>Descuento: {u.tipoDescuento}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListadoUsuario;
