import React, { useState, useEffect } from "react";
import "../css/ListadoOmnibus.css";
import { useNavigate } from 'react-router-dom';
import NavbarVendedor from "../components/NavbarVendedor";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";


function ListadoOmnibus() {
    const [localidad_actual, setLocalidad] = useState("");
    const [estado, setEstado] = useState("ACTIVO");
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
        fetch("http://localhost:8080/omnibus/obtenerall", {
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
                if (data.length < 1)
                    mostrarAlertaError("No se encontraron omnibus.");
                setOmnibus(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron omnibus.");
                setOmnibus([]);
            });
    }

    function validar_datos() {
        let activo = false;
        if (estado === "ACTIVO")
            activo = true

        fetch("http://localhost:8080/omnibus/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                localidad: localidad_actual,
                estado: activo,
                matricula: matricula.toUpperCase(),
                asientos: cantidad
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
                mostrarAlertaError("No se encontraron omnibus.");
                setOmnibus([]);
            });
    }

    async function cargarLocalidades() {
        //obtengo el componente donde va la lista de localidades
        const select_localidad_actual = document.getElementById("localidad_actual");

        select_localidad_actual.innerHTML = "<option value='' disabled selected>Localidad</option>";

        //get para obtener el array con las localidades
        const localidadesArray =
            await fetch("http://localhost:8080/localidad/obtener", {
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
            optionLocalidad.textContent = element.nombre.concat(", ", element.departamento);
            select_localidad_actual.appendChild(optionLocalidad);
        });
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
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="ACTIVO">Habilitado</option>
                            <option value="BLOQUEADO">Deshabilitado</option>
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

                <div className="viajes-list">
                    {omnibusOrdenados.map((o, i) => (
                        <div key={i} className="card-viaje">
                            <h5>Matricula: {o.matricula}, Serie: {capitalizar(o.numeroSerie)}</h5>
                            <div className="linea">
                                <p>Marca: {o.marca}</p>
                                <p>Modelo: {o.modelo}</p>
                            </div>
                            <p>Capacidad: {o.capacidad}</p>
                            <p>Localidad: {capitalizar(o.localidadActual.nombre)}, {capitalizar(o.localidadActual.departamento)}</p>
                            <p>Estado: {o.estado ? "Habilitado" : "Deshabilitado"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListadoOmnibus;
