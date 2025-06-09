import React, { useState, useEffect } from "react";
import "../css/Listado.css";
import { useNavigate } from 'react-router-dom';
import NavbarVendedor from "../components/NavbarVendedor";
import DevolucionPasaje from "./DevolucionPasaje.jsx";


function ListadoViaje() {
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fecha, setFecha] = useState("");
    const [viajes, setViajes] = useState([]);
    const [orden, setOrden] = useState("");
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};

    function validar_datos() {
        if (origen.trim() === "" || destino.trim() === "" || fecha.trim() === "") {
            alert("Complete todos los campos.");
            return;
        }

        fetch("http://localhost:8080/viaje/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                origen: origen,
                destino: destino,
                fecha: fecha + "T00:00:00",
                cantidad: 0
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron viajes.");

                }
                return response.json();
            })
            .then(data => {
                setViajes(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se encontraron viajes.");
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
            const optionOrigen = document.createElement("option");
            optionOrigen.value = element.idLocalidad;
            optionOrigen.textContent = element.nombre.concat(", ", element.departamento);
            selectOrigen.appendChild(optionOrigen);

            const optionDestino = document.createElement("option");
            optionDestino.value = element.idLocalidad;
            optionDestino.textContent = element.nombre.concat(", ", element.departamento);
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

    const viajesOrdenados = [...viajes];
    if (orden === "precio")
        viajesOrdenados.sort((a, b) => a.precio - b.precio);
    else if (orden === "hora")
        viajesOrdenados.sort((a, b) => new Date(a.fechaSalida) - new Date(b.fechaSalida));

    const navigate = useNavigate();
    function devolver_pasaje(viaje) {
        navigate("/devolucionpasaje", {
            state: {
                viaje: viaje
            }
        });
    }
    return (
        <>
           <NavbarVendedor />
              <div className="layout">
                <div className="filtros">
                    <div className="buscador">
                        <select id="select-origen" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                            <option value="" disabled>Origen</option>
                        </select>
                        <select id="select-destino" value={destino} onChange={(e) => setDestino(e.target.value)}>
                            <option value="" disabled>Destino</option>
                        </select>
                        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                        <button onClick={validar_datos}>Buscar</button>
                    </div>

                    <div className="ordenar">
                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option value="" disabled>Ordenar por</option>
                            <option value="precio">Precio</option>
                            <option value="hora">Hora</option>
                        </select>
                    </div>
                </div>

                <div className="viajes-list">
                    {viajesOrdenados.map((v, i) => (
                        <div key={i} className="card-viaje">
                            <h5>{capitalizar(v.origen.nombre)}, {capitalizar(v.origen.departamento)} → {capitalizar(v.destino.nombre)}, {capitalizar(v.destino.departamento)}</h5>
                            <p>Fecha: {v.fechaSalida.split("T")[0]} Hora: {v.fechaSalida.split("T")[1]}</p>
                            <button onClick={() => devolver_pasaje(v)}>Devolver</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListadoViaje;
