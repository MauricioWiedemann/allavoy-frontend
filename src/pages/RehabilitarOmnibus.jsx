import React, { useState, useEffect } from "react";
import "../css/DeshabilitarOmnibus.css"
import NavbarVendedor from "../components/NavbarVendedor";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";


function RehabilitarOmnibus() {
    const [localidad_actual, setLocalidad] = useState("");
    const [matricula, setMatricula] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [omnibus, setOmnibus] = useState([]);
    const [orden, setOrden] = useState("");
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

    function listar_omnibus() {
        fetch("https://allavoy-backend.onrender.com/omnibus/deshabilitados", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron omnibus.");

                }
                return response.json();
            })
            .then(data => {
                setOmnibus(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron omnibus.");
                setOmnibus([]);
            });
    }

    function validar_datos() {
        fetch("https://allavoy-backend.onrender.com/omnibus/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                localidad: localidad_actual,
                estado: false,
                matricula: matricula.toUpperCase(),
                capacidad: cantidad
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron omnibus.");

                }
                return response.json();
            })
            .then(data => {
                setOmnibus(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron omnibus.");
                setOmnibus([]);
            });
    }

    async function cargarLocalidades() {
        const select_localidad_actual = document.getElementById("localidad_actual");
        select_localidad_actual.innerHTML = "<option value='' disabled selected>Localidad</option>";
        const localidadesArray =
            await fetch("https://allavoy-backend.onrender.com/localidad/obtener", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json();
            })
                .then(data => {
                    return data;
                })
            ;
        localidadesArray.forEach(element => {
            const optionLocalidad = document.createElement("option");
            optionLocalidad.value = element.idLocalidad;
            optionLocalidad.textContent = element.nombre.concat(", ", element.departamento.replace("_", " "));
            select_localidad_actual.appendChild(optionLocalidad);
        });
    }

    async function rehabilitar(o) {
        await fetch("https://allavoy-backend.onrender.com/omnibus/rehabilitar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idOmnibus: o.idOmnibus
            })
        }).then(response => {
            return response.text();
        }).then(data => {
            mostrarAlerta(data);

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
    }

    //cargar las localidades al cargar la pagina
    useEffect(() => {
        cargarLocalidades();
        listar_omnibus();
    }, []);

    function capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const omnibusOrdenados = [...omnibus];
    if (orden === "orden_localidad") {
        omnibusOrdenados.sort((a, b) => a.localidadActual.nombre.localeCompare(b.localidadActual.nombre));
    } else if (orden === "mas_asientos") {
        omnibusOrdenados.sort((a, b) => b.capacidad - a.capacidad);
    } else if (orden === "menos_asientos") {
        omnibusOrdenados.sort((a, b) => a.capacidad - b.capacidad);
    }

    function validarTokenUsuario() {
        try {
            let payload = jwtDecode(localStorage.getItem("token"));
            if (payload.rol !== "VENDEDOR")
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
            <NavbarVendedor />
            <div className="layout">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                <div className="filtros">
                    <div className="buscador">
                        <select id="localidad_actual" value={localidad_actual} onChange={(e) => setLocalidad(e.target.value)}>
                            <option value="" disabled>Localidad</option>
                        </select>
                        <input type="text" placeholder="Matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                        <input type="number" min="1" placeholder="Asientos" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        <button onClick={validar_datos}>Buscar</button>
                    </div>

                    <div className="ordenar">
                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option value="" disabled>Ordenar por</option>
                            <option value="orden_localidad">Localidad</option>
                            <option value="mas_asientos">Mas asientos</option>
                            <option value="menos_asientos">Menos asientos</option>
                        </select>
                    </div>
                </div>

                <div className="deshabilitar-list">
                    {omnibusOrdenados.map((o, i) => (
                        <div key={i} className="deshabilitar-card">
                            <h5>Matricula: {o.matricula}, Serie: {o.numeroSerie}</h5>
                            <div className="linea">
                                <p>Marca: {o.marca}</p>
                                <p>Modelo: {o.modelo}</p>
                            </div>
                            <p>Capacidad: {o.capacidad}</p>
                            <div id="test">
                                <p>Localidad: {capitalizar(o.localidadActual.nombre)}, {capitalizar(o.localidadActual.departamento)}</p>
                                <button className="btn btn-primary rounded-pill" onClick={() => rehabilitar(o)}>Rehabilitar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default RehabilitarOmnibus;
