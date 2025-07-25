import React, { useEffect, useState } from "react";
import "../css/CierreVentaPasaje.css"
import NavbarVendedor from "../components/NavbarVendedor";
import ViajeCerrarVenta from "../components/ViajeCerrarVenta";
import { useViajeContext } from "../context/ViajeContext";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function CierreVentaPasaje() {

    const { viajeCerrarVenta, limpiarViajeCerraVenta } = useViajeContext();
    const [listaViajes, setListaViajes] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");

    function mostrarAlerta(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("mensaje");
    };

    function checkListaViaje() {
        var btn = document.getElementById("btn-cerrar");
        var par = document.getElementById("p-container");
        if (JSON.stringify(listaViajes) === "[]") {
            btn.style.display = "none";
            par.style.display = "block";
        } else {
            btn.style.display = "block";
            par.style.display = "none";
        }
    }

    async function obtenerViajes() {
        //obtener viajes activos
        await fetch(`${BASE_URL}/viaje/obteneractivos`, {
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

    useEffect(() => {
        limpiarViajeCerraVenta();
        obtenerViajes();
    }, []);

    useEffect(() => {
        checkListaViaje();
    }, [listaViajes]);

    function cerrarVenta() {
        if (JSON.stringify(viajeCerrarVenta).trim() === "[]") {
            mostrarAlerta("Seleccione un viaje.");
        } else {
            fetch(`${BASE_URL}/viaje/cerrarventa`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idViaje: viajeCerrarVenta.viaje.idViaje
                })
            })
                .then(response => {
                    return response.text();
                })
                .then(data => {
                    limpiarViajeCerraVenta();
                    mostrarAlerta(data);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
        }
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
            <div className="cierreVenta-bg">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                <div className="cierreVenta-card card p-4 shadow-lg">
                    <div className="mb-3">
                        {listaViajes.map((element) => (<ViajeCerrarVenta viaje={element} />))}
                    </div>
                    <div id="p-container">
                        <p>No hay viajes activos.</p>
                    </div>
                    <div className="d-grid gap-2">
                        <button id="btn-cerrar" className="btn w50 btn-primary rounded-pill" onClick={cerrarVenta}>Cerrar Venta</button>
                        <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CierreVentaPasaje;