import React, { useState, useEffect } from "react";
import "../css/ListadoOmnibus.css";
import { jwtDecode } from 'jwt-decode';
import NavbarCliente from "../components/NavbarCliente";
import Notificaion from "../components/Notificacion";


function ListadoViaje() {
    const [historico, setHistorico] = useState([]);
    const [payload, setPayload] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");


    function mostrarAlertaError(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("error")
    };

    function validar_datos() {
        fetch("http://localhost:8080/pasajes/historicocompra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: payload.sub
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron pasajes.");

                }
                return response.json();
            })
            .then(data => {
                if (data.length < 1)
                    mostrarAlertaError("No se encontraron omnibus.");
                console.log(data);
                setHistorico(data);
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlertaError("No se encontraron pasajes.");
                setHistorico([]);
            });
    }

    function validarTokenUsuario() {
        try {
            setPayload(jwtDecode(localStorage.getItem("token")));
        } catch (e) {
            window.location.href = "/404";
        }
    }

    useEffect(() => {
        validarTokenUsuario();
    }, []);

    useEffect(() => {
        validar_datos();
    }, [payload]);

    return (
        <>
            <NavbarCliente />
            <div className="layout">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                {<div className="viajes-list">
                    {historico.map((h, i) => (
                        <div key={i} className="card-viaje">
                            <h5>{h.origen.nombre}, {h.origen.departamento} → {h.destino.nombre}, {h.destino.departamento}</h5>
                            <div className="linea">
                                <p>Salida: {new Date(h.fechaSalida).toLocaleString()}</p>
                                <p>Llegada: {new Date(h.fechaLlegada).toLocaleString()}</p>
                            </div>
                            <p>Asiento: {h.asiento}</p>
                            <p>Precio: ${h.precio}</p>
                            <p>Monto pagado: ${h.monto}</p>
                            <p>Descuento: {h.descuento}%</p>
                            <p>Devuelto: {h.devuelto ? "Sí" : "No"}</p>
                            {h.fechaDevolucion && <p>Fecha de Devolución: {new Date(h.fechaDevolucion).toLocaleString()}</p>}
                        </div>
                    ))}
                </div>}
            </div>
        </>
    );
}

export default ListadoViaje;
