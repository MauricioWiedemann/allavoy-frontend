import React, { useState, useEffect } from "react";
import "../css/Listado.css";
import { useNavigate } from 'react-router-dom';
import NavbarCliente from "../components/NavbarCliente";
import NavbarVendedor from "../components/NavbarVendedor";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function ListadoViajeCompra() {
    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fecha, setFecha] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [viajes, setViajes] = useState([]);
    const [orden, setOrden] = useState("");
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const [idaYVuelta, setIdaYVuelta] = useState(1);
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");


    function mostrarAlertaError(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("error")
    };


    function validar_datos() {
        if (origen.trim() === "" || destino.trim() === "" || fecha.trim() === "" || cantidad.trim() === "") {
            mostrarAlertaError("Complete todos los campos.");
            return;
        } else if (cantidad.trim() < 1) {
            mostrarAlertaError("La cantidad no puede ser menor a 1.");
            return;
        }
        fetch(`${BASE_URL}/viaje/buscar`, {
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
                if (data.length<=0) {
                    throw new Error("No se encontraron viajes.");
                }
                setViajes(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron viajes.");
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

    const viajesOrdenados = [...viajes];
    if (orden === "precio")
        viajesOrdenados.sort((a, b) => a.precio - b.precio);
    else if (orden === "hora")
        viajesOrdenados.sort((a, b) => new Date(a.fechaSalida) - new Date(b.fechaSalida));

    const navigate = useNavigate();
    function comprar_pasaje(viaje) {
        if (idaYVuelta == 1) {
            navigate("/compra", {
                state: {
                    viaje: viaje,
                    cantidad: parseInt(cantidad, 10),
                    idaYVuelta
                }
            });
        } else {
            navigate("/compraida", {
                state: {
                    viaje: viaje,
                    cantidad: parseInt(cantidad, 10),
                    idaYVuelta
                }
            });
        }
    }

    function validarTokenUsuario() {
        try {
            let payload = jwtDecode(localStorage.getItem("token"));
            if (payload.rol !== "VENDEDOR" && payload.rol !== "CLIENTE")
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
            {payload.rol === "VENDEDOR" ? <NavbarVendedor /> : <NavbarCliente />}
            <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
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
                        <input type="number" min="1" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                        <select id="select-ida-vuelta" value={idaYVuelta} onChange={(e) => setIdaYVuelta(e.target.value)}>
                            <option value="1">Simple</option>
                            <option value="2">Ida y vuelta</option>
                        </select>
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
                            <p>Asientos Disponibles: {v.cantidad}</p>
                            <p>Precio: {v.precio}</p>
                            <button onClick={() => comprar_pasaje(v)}>Comprar</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ListadoViajeCompra;
