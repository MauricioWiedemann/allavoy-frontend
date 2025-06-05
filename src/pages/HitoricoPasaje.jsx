import React, { useState, useEffect } from "react";
import "../css/ListadoOmnibus.css";
import { jwtDecode } from 'jwt-decode';
import NavbarCliente from "../components/NavbarCliente";

function ListadoViaje() {
    const [historico, setHistorico] = useState([]);


    function validar_datos() {
        const token = localStorage.getItem("token");
        const payload = jwtDecode(token);
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
                    throw new Error("No se encontraron omnibus.");

                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setHistorico(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se encontraron omnibus.");
                setHistorico([]);
            });
    }
    useEffect(() => {
        validar_datos()
    }, []);



    return (
        <>
            <NavbarCliente />
            <div className="layout">
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
