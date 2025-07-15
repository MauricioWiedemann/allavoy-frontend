import React, { useState, useEffect } from "react";
import "../css/DeshabilitarOmnibus.css"
import { jwtDecode } from 'jwt-decode';
import NavbarVendedor from "../components/NavbarVendedor";
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function DeshabilitarOmnibus() {
    const [localidad_actual, setLocalidad] = useState("");
    const [matricula, setMatricula] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [omnibus, setOmnibus] = useState([]);
    const [omnibusSeleccionado, setOmnibusSeleccionado] = useState();
    const [orden, setOrden] = useState("");
    const [open, setOpen] = useState(false);
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
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
        fetch(`${BASE_URL}/omnibus/habilitados`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron ómnibus.");

                }
                return response.json();
            })
            .then(data => {
                setOmnibus(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron ómnibus.");
                setOmnibus([]);
            });
    }

    function validar_datos() {
        fetch(`${BASE_URL}/omnibus/buscar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                localidad: localidad_actual,
                estado: true,
                matricula: matricula.toUpperCase(),
                capacidad: cantidad
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron ómnibus.");

                }
                return response.json();
            })
            .then(data => {
                setOmnibus(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron ómnibus.");
                setOmnibus([]);
            });
    }

    async function cargarLocalidades() {
        //obtengo el componente donde va la lista de localidades
        const select_localidad_actual = document.getElementById("localidad_actual");

        select_localidad_actual.innerHTML = "<option value='' disabled selected>Localidad</option>";

        //get para obtener el array con las localidades
        const localidadesArray =
            await fetch(`${BASE_URL}/localidad/obtener`, {
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
        //generar los option que se insertara en el select con los datos de las localidades
        localidadesArray.forEach(element => {
            const optionLocalidad = document.createElement("option");
            optionLocalidad.value = element.idLocalidad;
            optionLocalidad.textContent = element.nombre.concat(", ", element.departamento.replace("_", " "));
            select_localidad_actual.appendChild(optionLocalidad);
        });
    }

    function seleccionarOmnibus(o) {
        setOmnibusSeleccionado(o);
        setOpen(true);
    }

    function validarFecha() {
        if ((fecha.trim() !== "" && hora.trim() === "") || (fecha.trim() === "" && hora.trim() !== "")) {
            return false;
        } else {
            return true;
        }
    }

    async function deshabilitar() {
        if (!validarFecha()) {
            mostrarAlertaError("Complete ambos campos.");
        } else if (fecha.trim() !== "" && new Date(fecha.concat("T".concat(hora))) < new Date()) {
            mostrarAlertaError("La fecha debe ser actual o futura.");
        } else {
            await fetch(`${BASE_URL}/omnibus/deshabilitar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idOmnibus: omnibusSeleccionado.idOmnibus,
                    fecha: fecha,
                    hora: hora
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

    function cancelar() {
        setOpen(false);
        setFecha("");
        setHora("");
        setOmnibusSeleccionado();
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
                            <option value="mas_asientos">Más asientos</option>
                            <option value="menos_asientos">Menos asientos</option>
                        </select>
                    </div>
                </div>

                <div className="deshabilitar-list">
                    {omnibusOrdenados.map((o, i) => (
                        <div key={i} className="deshabilitar-card">
                            <h5>Matrícula: {o.matricula}, Serie: {o.numeroSerie}</h5>
                            <div className="linea">
                                <p>Marca: {o.marca}</p>
                                <p>Modelo: {o.modelo}</p>
                            </div>
                            <p>Capacidad: {o.capacidad}</p>
                            <div id="test">
                                <p>Localidad: {capitalizar(o.localidadActual.nombre)}, {capitalizar(o.localidadActual.departamento)}</p>
                                <button className="btn btn-danger rounded-pill" onClick={() => seleccionarOmnibus(o)}>Deshabilitar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {open && (
                <div id="selectFechaHora-container">
                    <div id="selectFechaHora">
                        <div>
                            <h4>Seleccione una fecha y hora</h4>
                            <input type="date" className="form-control rounded-pill mb-1 mt-3" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                            <input type="time" className="form-control rounded-pill mb-1" value={hora} onChange={(e) => setHora(e.target.value)} />
                            <p>Si deja estos campos vaciós el ómnibus será dado de baja inmediatamente.</p>
                            <button className="btn btn-danger rounded-pill mb-1 mt-3" onClick={() => deshabilitar()}>Confirmar</button>
                            <button className="btn btn-secondary rounded-pill mb-1" onClick={() => cancelar()}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeshabilitarOmnibus;
