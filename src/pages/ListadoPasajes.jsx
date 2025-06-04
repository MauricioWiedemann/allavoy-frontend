import React, { useEffect, useState } from "react";
import "../css/ListadoPasajes.css";
import NavbarVendedor from "../components/NavbarVendedor";
import Modal from "../components/Modal";

function ListadoPasajes() {
    const [listaViajes, setListaViajes] = useState([]);
    const [listaPasajesVendidos, setListaPasajesVendidos] = useState([]);
    const [listaPasajesDevuletos, setListaPasajesDevuletos] = useState([]);
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);

    const [open, setOpen] = useState(false);

    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fecha, setFecha] = useState("");
    const [orden, setOrden] = useState("");

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

    async function obtenerViajes() {
        await fetch("http://localhost:8080/viaje/obtenertodos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        })
            .then(data => {
                setListaViajes(data);
            })
            ;
    }

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
                setListaViajes(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se encontraron viajes.");
                setListaViajes([]);
            });
    }

    function capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    async function obtenerPasajesVendidos() {
        await fetch("http://localhost:8080/pasajes/obtenervendidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idViaje: viajeSeleccionado.idViaje
            })
        }).then(response => {
            return response.json();
        })
            .then(data => {
                console.log("1", data);
                setListaPasajesVendidos(data);
            })
            ;
    }

    async function obtenerPasajesDevueltos() {
        await fetch("http://localhost:8080/pasajes/obtenerdevueltos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idViaje: viajeSeleccionado.idViaje
            })
        }).then(response => {
            return response.json();
        })
            .then(data => {
                console.log("2", data);
                setListaPasajesDevuletos(data);
            })
            ;
    }

    function swapCharacters(inputString) {
        let charArray = inputString.split('');
        charArray[10] = " ";
        return charArray.join('');
    }

    useEffect(() => {
        obtenerViajes();
        cargarLocalidades();
    }, []);

    useEffect(() => {
        obtenerPasajesVendidos();
        obtenerPasajesDevueltos();
    }, [viajeSeleccionado]);

    const viajesOrdenados = [...listaViajes];
    if (orden === "mayor-fecha")
        viajesOrdenados.sort((a, b) => new Date(b.fechaSalida) - new Date(a.fechaSalida));
    else if (orden === "menor-fecha")
        viajesOrdenados.sort((a, b) => new Date(a.fechaSalida) - new Date(b.fechaSalida));

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
                            <option value="mayor-fecha">Mayor fecha</option>
                            <option value="menor-fecha">Menor fecha</option>
                        </select>
                    </div>
                </div>

                <div className="viajes-list">
                    {viajesOrdenados.map((v, i) => (
                        <div key={i} className="card-viaje">
                            <h5>{capitalizar(v.origen.nombre)}, {capitalizar(v.origen.departamento)} → {capitalizar(v.destino.nombre)}, {capitalizar(v.destino.departamento)}</h5>
                            <p>Fecha: {v.fechaSalida.split("T")[0]} Hora: {v.fechaSalida.split("T")[1]}</p>
                            <p>Asientos Disponibles: {v.cantidad}</p>
                            <p>Precio: {v.precio}</p>
                            <button onClick={() => { setViajeSeleccionado(v); setOpen(true); }}>Seleccionar</button>
                        </div>
                    ))}
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                {viajeSeleccionado && (
                    <div style={{ padding: "1rem" }}>
                        <h3 className="text-lg font-black text-gray-800">Viaje seleccionado</h3>
                        <p>{viajeSeleccionado.origen.nombre} → {viajeSeleccionado.destino.nombre}</p>
                        <p>Fecha: {viajeSeleccionado.fechaSalida}</p>
                        <p>Precio: {viajeSeleccionado.precio}</p>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default ListadoPasajes;
