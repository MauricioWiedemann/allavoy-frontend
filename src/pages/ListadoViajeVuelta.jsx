import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Listado.css";
import NavbarCliente from "../components/NavbarCliente";
import NavbarVendedor from "../components/NavbarVendedor";
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function ListadoViaje() {
    const [fecha, setFecha] = useState("");
    const [viajes, setViajes] = useState([]);
    const [orden, setOrden] = useState("");
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const location = useLocation();
    const cantidad = location.state?.cantidad;
    const viajeIda = location.state?.viaje;
    const asientoIda = location.state.asientoIda;
    const origen = viajeIda.origen;
    const destino = viajeIda.destino;
    const idaYVuelta = location.state?.idaYVuelta
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");


    function mostrarAlertaError(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("error")
    };

    function validar_datos() {
        if (fecha.trim() === "") {
            mostrarAlertaError("Complete todos los campos.");
            return;
        }
        console.log("Origen:", origen.idLocalidad);
        console.log("Destino:", destino.idLocalidad);
        fetch(`${BASE_URL}/viaje/buscar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                origen: destino.idLocalidad,
                destino: origen.idLocalidad,
                fecha: fecha + "T00:00:00",
                cantidad
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new mostrarAlertaError("No se encontraron viajes.");

                }
                return response.json();
            })
            .then(data => {
                setViajes(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron viajes.");
                setViajes([]);
            });
    }

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
                viajeIda,
                viaje,
                cantidad,
                asientoIda,
                idaYVuelta
            }
        });
    }
    return (
        <>
            {payload.rol === "VENDEDOR" ? <NavbarVendedor /> : <NavbarCliente />}            <div className="layout">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />

                <div className="filtros">
                    <div className="buscador">
                        <label>Origen</label>
                        <input type="text" value={destino.nombre.concat(" ", viajeIda.destino.departamento)} readOnly />
                        <label>Destino</label>
                        <input type="text" value={origen.nombre.concat(" ", viajeIda.origen.departamento)} readOnly />
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

export default ListadoViaje;
