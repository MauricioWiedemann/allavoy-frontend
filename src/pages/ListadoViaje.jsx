import React, { useState, useEffect } from "react";
import "../css/Listado.css";
import { useNavigate } from 'react-router-dom';
import NavbarCliente from "../components/NavbarCliente";

function ListadoViaje() {
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [viajes, setViajes] = useState([]);
    const [orden, setOrden] = useState("");

    function validar_datos() {
        if (origen.trim() === "" || destino.trim() === "" || fecha.trim() === "" || cantidad.trim() === "") {
            alert("Complete todos los campos.");
            return;
        } else if (cantidad.trim() < 1) {
            alert("La cantidad no puede ser menor a 1.");
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
                cantidad: cantidad
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
    function comprar_pasaje(viaje) {
      navigate("/compra", {
        state: {
          viaje: viaje,
          cantidad: parseInt(cantidad, 10)
        }
      });
    }

    return (
        <>
            <NavbarCliente />
            <div className="listadoViaje-container">
                <div className="buscador-card card p-4 mt-3 mb-3 shadow-lg">
                    <div className="campos-flex mb-3">
                        <select className="form-select rounded-pill" id="select-origen" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                            <option value="" disabled>Origen</option>
                        </select>
                        <select className="form-select rounded-pill" id="select-destino" value={destino} onChange={(e) => setDestino(e.target.value)}>
                            <option value="" disabled>Destino</option>
                        </select>
                        <input type="date" className="form-control rounded-pill" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                        <input type="number" className="form-control rounded-pill" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        <button className="btn btn-primary rounded-pill" onClick={validar_datos}>Buscar</button>
                    </div>
                </div>

                <div className="ordenar-container">
                    <select className="form-select rounded-pill ordenar-select" value={orden} onChange={(e) => setOrden(e.target.value)} >
                        <option value="" selected disabled>Ordenar por</option>
                        <option value="precio">Precio</option>
                        <option value="hora">Hora</option>
                    </select>
                </div>

                <div className="viajes-list">
                    {viajesOrdenados.map((viaje, index) => (
                        <div key={index} className="viaje-card card p-4 shadow-lg">
                            <h5>{capitalizar(viaje.origen.nombre)}, {capitalizar(viaje.origen.departamento)} → {capitalizar(viaje.destino.nombre)}, {capitalizar(viaje.destino.departamento)}</h5>
                            <p>Fecha: {viaje.fechaSalida.split("T")[0]}            Hora: {viaje.fechaSalida.split("T")[1]}</p>
                            <p>Asientos Disponibles: {viaje.cantidad}</p>
                            <p>Precio: {viaje.precio}</p>
                            <button className="btn btn-primary btn-sm rounded-pill comprar-btn" onClick={() => comprar_pasaje(viaje)}>Comprar</button>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default ListadoViaje;
