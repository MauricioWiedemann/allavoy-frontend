import React, { useState, useEffect } from "react";
import "../css/ListadoOmnibus.css";
import { useNavigate } from 'react-router-dom';
import NavbarVendedor from "../components/NavbarVendedor";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function ListadoOmnibusAsignados() {
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [orden, setOrden] = useState("");
    const [fechaInicio, setfechaInicio] = useState("");
    const [fechaDestino, setfechaDestino] = useState("");
    const [estado, setEstadoViaje] = useState("ACTIVO");
    const [matricula, setMatricula] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [viaje, setViajes] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");


    function mostrarAlertaError(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("error")
    };

    function listar_viajes() {
        fetch(`${BASE_URL}/viaje/obtenertodos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron viajes.");

                }
                return response.json();
            })
            .then(data => {
                setViajes(data);
                if (data.length() < 1)
                    mostrarAlertaError("No se encontraron viajes.")
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron viajes.");
                setViajes([]);
            });
    }

    function listar_asignados() {
        let activo = true;
        if (estado === "ACTIVO")
            activo = false

        fetch(`${BASE_URL}/viaje/listaasignados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "origen": origen,
                "destino": destino,
                "fechaInicio": fechaInicio ? fechaInicio + "T00:00:00" : null,
                "fechaFin": fechaDestino ? fechaDestino + "T00:00:00" : null,
                "estado": activo,
                "matricula": matricula,
                "capacidad": cantidad
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron ómnibus.");

                }
                return response.json();
            })
            .then(data => {
                if (data.length < 1)
                    mostrarAlertaError("No se encontraron viajes.");
                setViajes(data);
            })
            .catch(error => {
                mostrarAlertaError("No se encontraron ómnibus.");
                setViajes([]);
            });
    }


    async function cargarLocalidades() {
        //obtengo el componente donde va la lista de localidades
        const selectOrigen = document.getElementById("select-origen");
        const selectDestino = document.getElementById("select-destino");

        selectOrigen.innerHTML = "<option value='' disabled selected>Origen</option>";
        selectDestino.innerHTML = "<option value='' disabled selected>Destino</option>";

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
            const optionOrigen = document.createElement("option");
            optionOrigen.value = element.idLocalidad;
            optionOrigen.textContent = element.nombre.concat(", ", element.departamento.replace("_", " "));
            selectOrigen.appendChild(optionOrigen);

            const optionDestino = document.createElement("option");
            optionDestino.value = element.idLocalidad;
            optionDestino.textContent = element.nombre.concat(", ", element.departamento.replace("_", " "));
            selectDestino.appendChild(optionDestino);
        });
    }

    //cargar las localidades al cargar la pagina
    useEffect(() => {
        cargarLocalidades();
    }, []);

    function capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const viajesOrdenados = [...viaje];
    if (orden === "orden_destino") {
        viajesOrdenados.sort((a, b) => a.destino.nombre.localeCompare(b.destino.nombre));
    } else if (orden === "orden_origen") {
        viajesOrdenados.sort((a, b) => a.origen.nombre.localeCompare(b.origen.nombre));
    } else if (orden === "orden_cerrado") {
        viajesOrdenados.sort((a, b) => (a.ventaCerrada === b.ventaCerrada) ? 0 : a.ventaCerrada ? 1 : -1);
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
                        <select id="select-origen" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                            <option value="" disabled>Origen</option>
                        </select>
                        <select id="select-destino" value={destino} onChange={(e) => setDestino(e.target.value)}>
                            <option value="" disabled>Destino</option>
                        </select>
                        <input type="date" value={fechaInicio} onChange={(e) => setfechaInicio(e.target.value)} />
                        <input type="date" value={fechaDestino} onChange={(e) => setfechaDestino(e.target.value)} />
                        <input type="text" placeholder="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                        <select value={estado} onChange={(e) => setEstadoViaje(e.target.value)}>
                            <option value="ACTIVO">Habilitado</option>
                            <option value="BLOQUEADO">Deshabilitado</option>
                        </select>
                        <input type="number" min="1" placeholder="Asientos" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        <button onClick={listar_asignados}>Buscar</button>
                    </div>
                    <div className="ordenar">
                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option value="" disabled>Ordenar por</option>
                            <option value="orden_origen">Origen</option>
                            <option value="orden_destino">Destino</option>
                            <option value="orden_cerrado">Venta cerrado</option>
                        </select>
                    </div>
                </div>

                <div className="viajes-list">
                    {viajesOrdenados.map((v, i) => (
                        <div key={i} className="card-viaje">
                            <h5>{capitalizar(v.origen.nombre)}, {capitalizar(v.origen.departamento)} → {capitalizar(v.destino.nombre)}, {capitalizar(v.destino.departamento)}</h5>
                            <p>Fecha: {v.fechaSalida.split("T")[0]} Hora: {v.fechaSalida.split("T")[1]}</p>
                            <p>Asientos Disponibles: {v.asientos.length}</p>
                            <p>Precio: {v.precio}</p>
                            <p>Omnibus: {v.omnibus.matricula}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListadoOmnibusAsignados;
