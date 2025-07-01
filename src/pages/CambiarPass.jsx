import React, { useState, useEffect } from "react";
import "../css/CambiarPass.css";
import NavbarVendedor from "../components/NavbarVendedor";
import NavbarAdministrador from "../components/NavbarAdministrador";
import NavbarCliente from "../components/NavbarCliente";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function CambiarPass() {

    const [passActual, setPassActual] = useState("");
    const [passNuevo, setPassNuevo] = useState("");
    const [passNuevoCheck, setPassNuevoCheck] = useState("");
    const [payload, setPayload] = useState("");
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


    function cambiar() {
        if (passActual.trim() === "" || passNuevo.trim() === "" || passNuevoCheck.trim() === "") {
            mostrarAlertaError("Complete todos los campos.");
        } else if (passNuevo !== passNuevoCheck) {
            mostrarAlertaError("Las nuevas contraseñas no coinciden");
        } else if (passNuevo.length < 8 || !/\d/.test(passNuevo)) {
            mostrarAlertaError("La contraseña debe tener al menos 8 caracteres e incluir al menos un numero.");
        } else {
            fetch(`${BASE_URL}/usuario/cambiarpassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idUsuario: payload.idUsuario,
                    actual: passActual,
                    nueva: passNuevo
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al cambiar la contraseña.");
                    }
                    return response.body;
                })
                .then(data => {
                    console.log("Contraseña actualizada:", data);
                    mostrarAlerta("Contraseña actualizada.");
                    setTimeout(() => {
                        window.location.href = "/home";
                    }, 2000);
                })
                .catch(error => {
                    console.error("Error:", error);
                    mostrarAlertaError("Error al cambiar la contraseña.");
                });
        }
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

    return (
        <>
            {payload.rol === "CLIENTE" && <NavbarCliente />}
            {payload.rol === "VENDEDOR" && <NavbarVendedor />}
            {payload.rol === "ADMINISTRADOR" && <NavbarAdministrador />}
            <div className="cambiarPass-bg">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                <div className="cambiarPass-card card p-4 shadow-lg">
                    <div className="mb-3">
                        <p>Ingrese su contraseña actual:</p>
                        <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={passActual} onChange={(e) => setPassActual(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <p>Ingrese la nueva contraseña:</p>
                        <input type="password" className="form-control rounded-pill" placeholder="Contraseña nueva" value={passNuevo} onChange={(e) => setPassNuevo(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <p>Ingrese nuevamente la nueva contraseña:</p>
                        <input type="password" className="form-control rounded-pill" placeholder="Contraseña nueva" value={passNuevoCheck} onChange={(e) => setPassNuevoCheck(e.target.value)} />
                    </div>
                    <div class="d-grid gap-2">
                        <button className="btn w50 btn-primary rounded-pill" onClick={cambiar} >Cambiar contraseña</button>
                        <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CambiarPass;