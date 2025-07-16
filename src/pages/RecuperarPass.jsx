import React, { useState, useEffect } from "react";
import "../css/SolicitarRecuperarPass.css"
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function RecuperarPass() {

    const [passwordNuevo, setPasswordNuevo] = useState("");
    const [passwordNuevoConf, setPasswordNuevoConf] = useState("");
    const [token, setToken] = useState("");
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

    async function validarNuevoPass() {
        if (passwordNuevo.trim() === "" || passwordNuevoConf.trim() === "") {
            mostrarAlertaError("Complete todos los campos.");
        } else if (passwordNuevo.trim() !== passwordNuevoConf.trim()) {
            mostrarAlertaError("Las contraseñas no coinciden.");
        } else {
            let statusOk = false;
            await fetch(`${BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token,
                    nuevaPass: passwordNuevo
                })
            }).then(response => {
                statusOk = response.ok;
                return response.text();
            }).then(data => {
                if(!statusOk){
                    throw new Error(data);
                }
                mostrarAlerta(data.toString());
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            })
                .catch(error => {
                    mostrarAlertaError(error.toString());
                });
        }
    }

    useEffect(() => {
        //obtener token para reestablecer la password
        let params = new URLSearchParams(location.search);
        setToken(params.get('token'));
    }, []);

    return (
        <>
            <div className="cambiar-pass-bg">
                <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
                <div className="cambiar-pass-card card p-4 shadow-lg">
                    <div className="mb-3">
                        <p>Ingrese su nueva contraseña:</p>
                        <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={passwordNuevo} onChange={(e) => setPasswordNuevo(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <p>Confirme su nueva contraseña:</p>
                        <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={passwordNuevoConf} onChange={(e) => setPasswordNuevoConf(e.target.value)} />
                    </div>
                    <div class="d-grid gap-1">
                        <button className="btn w50 btn-primary rounded-pill" onClick={validarNuevoPass} >Cambiar contraseña</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RecuperarPass;