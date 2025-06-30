import React, { useState } from "react";
import "../css/SolicitarRecuperarPass.css"
import Notificaion from "../components/Notificacion";


function SolicitarRecuperarPass() {

    const [correo, setCorreo] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");

    function mostrarAlerta(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("mensaje")
    };

    function mostrarAlertaError(m) {
        setAlertVisible(true);
        setMensaje(m);
        setTipo("error")
    };

    async function validarCorreo() {
        if (correo.trim() === "") {
            mostrarAlertaError("Ingrese un correo.")
        } else {
            await fetch("https://allavoy-backend.onrender.com/auth/recuperar-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: correo
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.text());
                }
                return response.text();
            }).then(data => {
                mostrarAlerta(data);

                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            })
                .catch(error => {
                    mostrarAlertaError("Usuario no encontrado");
                });
        }
    }

    return (
        <>
            <div className="cambiar-pass-bg">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                <div className="cambiar-pass-card card p-4 shadow-lg">
                    <div className="mb-3">
                        <p>Ingrese su correo electronico:</p>
                        <input type="email" className="form-control rounded-pill" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>
                    <div className="d-grid gap-1">
                        <button className="btn w50 btn-primary rounded-pill" onClick={validarCorreo} >Cambiar contraseña</button>
                        <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/login"} >Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SolicitarRecuperarPass;